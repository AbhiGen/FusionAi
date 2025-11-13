"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import React, { useState, useEffect, useContext } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import AiModels from "../../shared/AiModel";
import { DefaultModel } from "../../shared/AiModelDef";
import Image from "next/image";
import { Lock, MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AiSelectedModelContext } from "@/context/AiSelectedModels";
import { db } from "@/config/FirebaseConfig";
import { doc, setDoc, collection, getDocs, getDoc } from "firebase/firestore";

const AiMultiModel = () => {
  const { user, isSignedIn } = useUser();
  const [aimodel, setAiModels] = useState(AiModels);

  const {
    selectedModels,
    setSelectedModels,
    messages,
    setMessages,
    currentChatId,
  } = useContext(AiSelectedModelContext);

  /* ------------------------------------------------------------------ */
  /* 🔹 LOAD USER MODEL SELECTIONS */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const loadSelections = async () => {
      if (!user) return;
      try {
        const userEmail = user.primaryEmailAddress.emailAddress;
        const userCollection = collection(
          db,
          "users",
          userEmail,
          "aiModelSelections"
        );
        const querySnapshot = await getDocs(userCollection);
        const selections = {};
        querySnapshot.forEach((doc) => {
          selections[doc.id] = doc.data().selectedSubModel;
        });

        setAiModels((prev) =>
          prev.map((model) => {
            const saved = selections[model.model];
            return saved ? { ...model, selectedSubModel: saved } : model;
          })
        );
      } catch (error) {
        console.error("❌ Error loading model selections:", error);
      }
    };
    loadSelections();
  }, [user]);

  /* ------------------------------------------------------------------ */
  /* 🔹 RESET CHAT WHEN NEW CHAT STARTS */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!user || !currentChatId) return;

    const loadChatHistory = async () => {
      try {
        const userEmail = user.primaryEmailAddress.emailAddress;
        const chatDoc = doc(db, "users", userEmail, "chats", currentChatId);
        const snapshot = await getDoc(chatDoc);

        if (snapshot.exists()) {
          const chatData = snapshot.data();
          setMessages(chatData.messages || {});
          console.log("✅ Restored chat:", currentChatId);
        } else {
          // 🆕 Reset all chats for a fresh conversation
          const cleared = {};
          AiModels.forEach((m) => (cleared[m.model] = []));
          setMessages(cleared);
          console.log("🆕 Started a new fresh chat session:", currentChatId);
        }
      } catch (err) {
        console.error("❌ Error loading chat history:", err);
      }
    };

    loadChatHistory();
  }, [user, currentChatId]);

  /* ------------------------------------------------------------------ */
  /* 🔹 AUTO-SCROLL TO BOTTOM */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    aimodel.forEach((model) => {
      const chatDiv = document.getElementById(`chat-${model.model}`);
      if (chatDiv) chatDiv.scrollTop = chatDiv.scrollHeight;
    });
  }, [messages]);

  /* ------------------------------------------------------------------ */
  /* 🔹 TOGGLE MODEL ENABLE/DISABLE */
  /* ------------------------------------------------------------------ */
  const onToggleChange = (modelName, value) => {
    setAiModels((prev) =>
      prev.map((m) => (m.model === modelName ? { ...m, enable: value } : m))
    );
    setSelectedModels((prev) => ({
      ...prev,
      [modelName]: {
        ...(prev[modelName] || {}),
        enabled: value,
        modelId: prev[modelName]?.modelId || "",
      },
    }));
  };

  /* ------------------------------------------------------------------ */
  /* 🔹 SAVE SELECTED SUBMODEL */
  /* ------------------------------------------------------------------ */
  const handleModelSelect = async (parentModel, selectedSubModelId) => {
    if (!user) return console.warn("⚠️ Sign in to save model selection.");
    try {
      const model = aimodel.find((m) => m.model === parentModel);
      const selectedSub = model.subModel.find(
        (sub) => sub.id === selectedSubModelId
      );
      const userEmail = user.primaryEmailAddress.emailAddress;

      setAiModels((prev) =>
        prev.map((m) =>
          m.model === parentModel
            ? { ...m, selectedSubModel: selectedSub }
            : m
        )
      );
      setSelectedModels((prev) => ({
        ...prev,
        [parentModel]: {
          ...(prev[parentModel] || {}),
          modelId: selectedSub.id,
          enabled: prev[parentModel]?.enabled ?? true,
        },
      }));

      await setDoc(
        doc(db, "users", userEmail, "aiModelSelections", parentModel),
        {
          model: parentModel,
          selectedSubModel: {
            id: selectedSub.id,
            name: selectedSub.name,
            premium: selectedSub.premium,
          },
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("❌ Error saving model selection:", error);
    }
  };

  /* ------------------------------------------------------------------ */
  /* 🔹 SAVE CHAT TO FIRESTORE */
  /* ------------------------------------------------------------------ */
  const saveChatToDB = async (newMessages) => {
    if (!user || !currentChatId) return;
    try {
      const userEmail = user.primaryEmailAddress.emailAddress;
      const chatDoc = doc(db, "users", userEmail, "chats", currentChatId);
      await setDoc(chatDoc, { messages: newMessages }, { merge: true });
      console.log(`✅ Chat ${currentChatId} saved`);
    } catch (err) {
      console.error("❌ Error saving chat to DB:", err);
    }
  };

  /* ------------------------------------------------------------------ */
  /* 🔹 SEND MESSAGE */
  /* ------------------------------------------------------------------ */
  const handleSend = async (model, userInput) => {
    if (!isSignedIn) return alert("⚠️ Please sign in first to chat!");
    if (!model.enable || !userInput.trim()) return;

    const currentMessages = messages[model.model] || [];
    const updatedMessages = [
      ...currentMessages,
      { role: "user", content: userInput },
    ];
    setMessages((prev) => ({
      ...prev,
      [model.model]: updatedMessages,
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model.selectedSubModel?.id,
          msg: userInput,
          parentmodel: model.model,
        }),
      });
      const data = await response.json();
      const finalMessages = [
        ...updatedMessages,
        { role: "assistant", content: data.reply },
      ];
      setMessages((prev) => ({
        ...prev,
        [model.model]: finalMessages,
      }));
      await saveChatToDB({ ...messages, [model.model]: finalMessages });
    } catch (err) {
      console.error("❌ Error fetching AI response:", err);
    }
  };

  /* ------------------------------------------------------------------ */
  /* 🔹 UI HELPERS */
  /* ------------------------------------------------------------------ */
  const getFreeSubModels = (model) =>
    model.subModel.filter((sub) => !sub.premium);
  const getPremiumSubModels = (model) =>
    model.subModel.filter((sub) => sub.premium);
  const getDefaultModelName = (aiModel) => {
    const defaultId = DefaultModel[aiModel.model]?.modelId;
    const foundSubModel = aiModel.subModel.find((sub) => sub.id === defaultId);
    return (
      aiModel.selectedSubModel?.name ||
      (foundSubModel ? foundSubModel.name : "Select Model")
    );
  };

  /* ------------------------------------------------------------------ */
  /* 🔹 RENDER */
  /* ------------------------------------------------------------------ */
  return (
    <div className="flex flex-1 h-[75vh] border-b">
      {aimodel.map((model, index) => (
        <div
          key={model.model || index}
          className={`flex flex-col border-r h-full overflow-hidden ${
            model.enable
              ? "min-w-[350px] transition-all duration-300 ease-in-out"
              : "w-[100px] flex-none"
          }`}
        >
          {/* Header */}
          <div className="flex w-full items-center justify-between p-4 border-b h-[70px] bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <Image src={model.icon} alt={model.model} width={24} height={24} />
              {model.enable && (
                <Select
                  disabled={model.premium}
                  defaultValue={
                    model.selectedSubModel?.id ||
                    DefaultModel[model.model]?.modelId
                  }
                  onValueChange={(value) =>
                    handleModelSelect(model.model, value)
                  }
                >
                  <SelectTrigger className="w-[200px] rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder={getDefaultModelName(model)} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-lg">
                    {getFreeSubModels(model).length > 0 && (
                      <SelectGroup>
                        <SelectLabel>Free</SelectLabel>
                        {getFreeSubModels(model).map((subModel) => (
                          <SelectItem key={subModel.id} value={subModel.id}>
                            {subModel.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                    {getPremiumSubModels(model).length > 0 && (
                      <SelectGroup>
                        <SelectLabel className="flex items-center gap-2 text-yellow-600">
                          Premium <Lock size={12} />
                        </SelectLabel>
                        {getPremiumSubModels(model).map((subModel) => (
                          <SelectItem
                            key={subModel.id}
                            value={subModel.id}
                            disabled
                          >
                            {subModel.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              {model.enable ? (
                <Switch
                  checked={model.enable}
                  onCheckedChange={(v) => onToggleChange(model.model, v)}
                />
              ) : (
                <MessageSquare
                  className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => onToggleChange(model.model, true)}
                />
              )}
            </div>
          </div>

          {/* Chat area */}
          {model.enable && (
            <div
              id={`chat-${model.model}`}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
              {isSignedIn ? (
                messages[model.model]?.length > 0 ? (
                  messages[model.model].map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-3xl shadow-md text-sm leading-relaxed break-words transition-all duration-300 ${
                          m.role === "user"
                            ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                        }`}
                      >
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                          >
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 mt-4">
                    💬 Start chatting with {model.model}
                  </p>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
                  <p className="mb-4">🔒 Please sign in to start chatting</p>
                  <SignInButton mode="modal">
                    <Button className="rounded-xl px-6">Sign In</Button>
                  </SignInButton>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AiMultiModel;