"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Mic, Paperclip, Send } from "lucide-react";
import React, { useEffect, useState, useContext } from "react";
import AiMultiModels from "./AiMultiModel";
import { AiSelectedModelContext } from "@/context/AiSelectedModels";
import { db } from "@/config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

const ChatInputBox = () => {
  const [userInput, setUserInput] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const { user } = useUser();

  // Ensure context is consumed correctly with fallback
  const context = useContext(AiSelectedModelContext);
  const {
    selectedModels = {},
    messages = {},
    setMessages = () => console.warn("setMessages not available"),
    currentChatId = null,
  } = context || {};

  const saveChatToDB = async (newMessages) => {
    if (!user || !currentChatId) {
      console.warn("⚠️ Cannot save chat: user or currentChatId is missing", { user, currentChatId });
      setAlertMessage("⚠️ Unable to save chat. Please start a new chat.");
      setTimeout(() => setAlertMessage(""), 3000);
      return;
    }
    try {
      const userEmail = user.primaryEmailAddress.emailAddress;
      const chatDoc = doc(db, "users", userEmail, "chats", currentChatId);
      await setDoc(chatDoc, { messages: newMessages }, { merge: true });
      console.log(`✅ Chat ${currentChatId} saved`);
    } catch (err) {
      console.error("❌ Error saving chat to DB:", err);
      setAlertMessage("⚠️ Failed to save chat. Please try again.");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    // Filter enabled models
    const enabledModels = Object.entries(selectedModels).filter(
      ([, model]) => model.enabled && model.modelId
    );

    if (enabledModels.length === 0) {
      setAlertMessage("⚠️ Please enable and select a model to chat.");
      setTimeout(() => setAlertMessage(""), 3000);
      return;
    }

    // Add user message to enabled models
    setMessages((prev) => {
      const updated = { ...prev };
      enabledModels.forEach(([key]) => {
        updated[key] = [
          ...(updated[key] ?? []),
          { role: "user", content: userInput },
        ];
      });
      return updated;
    });

    const currentInput = userInput;
    setUserInput("");

    // Add "Thinking..." placeholders
    setMessages((prev) => {
      const updated = { ...prev };
      enabledModels.forEach(([key]) => {
        updated[key] = [
          ...(updated[key] ?? []),
          {
            role: "assistant",
            content: "Thinking...",
            model: key,
            loading: true,
          },
        ];
      });
      return updated;
    });

    // Send requests concurrently
    const requests = enabledModels.map(async ([parentModel, modelInfo]) => {
      try {
        const response = await axios.post("/api/ai-multi-model", {
          model: modelInfo.modelId,
          msg: [{ role: "user", content: currentInput }],
          parentModel,
        });

        const { aiResponse } = response.data;

        setMessages((prev) => {
          const updated = [...(prev[parentModel] ?? [])];
          const idx = updated.findIndex((m) => m.loading);
          if (idx !== -1) {
            updated[idx] = {
              role: "assistant",
              content: aiResponse,
              loading: false,
              model: parentModel,
            };
          }
          return { ...prev, [parentModel]: updated };
        });
      } catch (error) {
        setMessages((prev) => ({
          ...prev,
          [parentModel]: [
            ...(prev[parentModel] ?? []),
            {
              role: "assistant",
              content: "⚠️ Error fetching response.",
              loading: false,
              model: parentModel,
            },
          ],
        }));
      }
    });

    await Promise.allSettled(requests);

    // Save updated messages to Firestore
    await saveChatToDB(messages);
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="relative min-h-screen">
      {/* Model Manager */}
      <AiMultiModels />

      {/* Alert */}
      {alertMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-md shadow-md text-sm">
          {alertMessage}
        </div>
      )}

      {/* Input Section */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4">
        <div className="w-full max-w-2xl border rounded-xl shadow-md p-4 bg-white">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="border-0 outline-none w-full"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <div className="mt-3 flex justify-between items-center">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <div>
              <Button variant="ghost" size="icon" className="mr-2">
                <Mic className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleSend}
                size="icon"
                className="bg-black hover:bg-violet-600"
              >
                <Send className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInputBox;