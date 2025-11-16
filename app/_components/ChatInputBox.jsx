"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react"; // Removed Paperclip and Mic
import React, { useEffect, useState, useContext } from "react";
import AiMultiModels from "./AiMultiModel";
import { AiSelectedModelContext } from "@/context/AiSelectedModels";
import { db } from "@/config/FirebaseConfig";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";

const ChatInputBox = () => {
  const [userInput, setUserInput] = useState("");
  const { user } = useUser();
  const { theme } = useTheme();

  const context = useContext(AiSelectedModelContext);
  const {
    selectedModels = {},
    messages = {},
    setMessages = () => {},
    currentChatId,
    setCurrentChatId,
  } = context || {};

  /* ---------------------------------------------------------------------------
      SAVE CHAT TO FIRESTORE *ONLY INSIDE USER PATH*
     --------------------------------------------------------------------------- */
  const saveChatToDB = async (updatedMessages) => {
    if (!user || !currentChatId) {
      console.warn("⚠️ Cannot save chat: no user or chatId");
      return;
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    try {
      const userChatDoc = doc(db, "users", userEmail, "chats", currentChatId);

      await setDoc(
        userChatDoc,
        {
          chatId: currentChatId,
          messages: updatedMessages,
          updatedAt: Date.now(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      // UPDATE USER ROOT DOC WITH THIS CHAT
      const userMainDoc = doc(db, "users", userEmail);
      await setDoc(
        userMainDoc,
        {
          chats: { [currentChatId]: true },
        },
        { merge: true }
      );

      console.log("💾 Saved under: users/" + userEmail + "/chats/" + currentChatId);
    } catch (err) {
      console.error("❌ Error saving chat:", err);
    }
  };

  /* ---------------------------------------------------------------------------
      SEND MESSAGE HANDLER
     --------------------------------------------------------------------------- */
  const handleSend = async () => {
    if (!userInput.trim()) return;

    if (!currentChatId) {
      alert("⚠️ Start a new chat from the sidebar first.");
      return;
    }

    const enabledModels = Object.entries(selectedModels).filter(
      ([, m]) => m?.enabled && m?.modelId
    );

    if (enabledModels.length === 0) {
      alert("⚠️ Please enable a model before chatting.");
      return;
    }

    const userText = userInput;
    setUserInput("");

    /* ------------------------------ 1) ADD USER MESSAGE ----------------------------- */
    setMessages((prev) => {
      const updated = { ...prev };
      enabledModels.forEach(([name]) => {
        updated[name] = [...(updated[name] ?? []), { role: "user", content: userText }];
      });
      saveChatToDB(updated);
      return updated;
    });

    /* --------------------- 2) ADD THINKING PLACEHOLDER FOR EACH MODEL --------------------- */
    setMessages((prev) => {
      const updated = { ...prev };
      enabledModels.forEach(([name]) => {
        updated[name] = [
          ...(updated[name] ?? []),
          {
            role: "assistant",
            model: name,
            content: "Thinking...",
            loading: true,
          },
        ];
      });
      saveChatToDB(updated);
      return updated;
    });

    /* ------------------------------ 3) SEND TO API ------------------------------ */
    const requests = enabledModels.map(async ([parentModel, info]) => {
      try {
        const response = await axios.post("/api/ai-multi-model", {
          model: info.modelId,
          msg: [{ role: "user", content: userText }],
          parentmodel: parentModel,
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const { aiResponse } = response.data;

        setMessages((prev) => {
          const updated = { ...prev };
          const arr = [...(updated[parentModel] ?? [])];

          const index = arr.findIndex((m) => m.loading);
          if (index !== -1) {
            arr[index] = {
              role: "assistant",
              model: parentModel,
              content: aiResponse,
              loading: false,
            };
          }

          updated[parentModel] = arr;
          saveChatToDB(updated);
          return updated;
        });
      } catch (err) {
        console.error("❌ AI Error:", err);
        setMessages((prev) => {
          const updated = { ...prev };
          updated[parentModel] = [
            ...(updated[parentModel] ?? []),
            {
              role: "assistant",
              model: parentModel,
              content: `⚠️ Error: ${err.message || "Failed to fetch response."}`,
              loading: false,
            },
          ];
          saveChatToDB(updated);
          return updated;
        });
      }
    });

    await Promise.allSettled(requests);
  };

  return (
    <div className="relative min-h-screen">
      <AiMultiModels />

      {/* INPUT BOX */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4">
        <div
          className={`w-full max-w-2xl border rounded-xl shadow-md p-4 ${
            theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white"
          } dark:border-gray-700`}
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask me anything..."
              className={`border-0 outline-none flex-1 ${
                theme === "light" ? "text-black" : "text-white"
              } bg-transparent`}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              onClick={handleSend}
              size="icon"
              className={`bg-black hover:bg-violet-600 ${
                theme === "dark" ? "text-white" : "text-white"
              }`}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInputBox;