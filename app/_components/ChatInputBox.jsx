"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Mic, Paperclip, Send } from "lucide-react";
import React, { useEffect ,useState ,useContext } from "react";
import AiMultiModels from "./AiMultiModel";
import { AiSelectedModelContext } from "@/context/AiSelectedModels";

const ChatInputBox = () => {
  const [userInput, setUserInput] = useState("");

  // ✅ Ensure your context returns these 4 values
  const {selectedModels, setSelectedModels, messages, setMessages}=useContext(AiSelectedModelContext);

  /**
   * Handles sending a message to all selected AI models.
   * Updates UI state, handles loading placeholders, and manages responses/errors.
   */
  const handleSend = async () => {
    if (!userInput.trim()) return;

    // 1️⃣ Add user message to all enabled models
    setMessages((prev) => {
      const updated = { ...prev };
      Object.keys(selectedModels).forEach((modelKey) => {
        updated[modelKey] = [
          ...(updated[modelKey] ?? []),
          { role: "user", content: userInput },
        ];
      });
      return updated;
    });

    const currentInput = userInput;
    setUserInput("");

    // 2️⃣ Add "Thinking..." placeholders
    setMessages((prev) => {
      const updated = { ...prev };
      Object.keys(selectedModels).forEach((modelKey) => {
        if (selectedModels[modelKey].modelId) {
          updated[modelKey] = [
            ...(updated[modelKey] ?? []),
            {
              role: "assistant",
              content: "Thinking...",
              model: modelKey,
              loading: true,
            },
          ];
        }
      });
      return updated;
    });

    // 3️⃣ Send requests concurrently
    const modelRequests = Object.entries(selectedModels)
      .filter(([_, info]) => info.modelId)
      .map(async ([parentModel, modelInfo]) => {
        try {
          const response = await axios.post("/api/ai-multi-model", {
            model: modelInfo.modelId,
            msg: [{ role: "user", content: currentInput }],
            parentModel,
          });

          const { aiResponse, model } = response.data;

          // Replace "Thinking..." with AI response
          setMessages((prev) => {
            const updated = [...(prev[parentModel] ?? [])];
            const loadingIndex = updated.findIndex((m) => m.loading);

            if (loadingIndex !== -1) {
              updated[loadingIndex] = {
                role: "assistant",
                content: aiResponse,
                model,
                loading: false,
              };
            } else {
              updated.push({
                role: "assistant",
                content: aiResponse,
                model,
                loading: false,
              });
            }

            return { ...prev, [parentModel]: updated };
          });
        } catch (error) {
          console.error(`Error fetching response for ${parentModel}:`, error);
          setMessages((prev) => ({
            ...prev,
            [parentModel]: [
              ...(prev[parentModel] ?? []),
              {
                role: "assistant",
                content: "⚠️ Error fetching response.",
                model: parentModel,
                loading: false,
              },
            ],
          }));
        }
      });

    await Promise.allSettled(modelRequests);
  };

  useEffect(() => {
    console.log(messages)
  }, [messages]);

  return (
    <div className="relative min-h-screen">
      <div>
        <AiMultiModels />
      </div>

      <div className="fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4">
        <div className="w-full border rounded-xl shadow-md max-w-2xl p-4">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="border-0 outline-none w-full"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <div className="mt-3 flex justify-between items-center">
            <Button variant={"ghost"} size={"icon"}>
              <Paperclip className="h-5 w-5" />
            </Button>
            <div>
              <Button variant={"ghost"} size={"icon"} className={"mr-2"}>
                <Mic className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleSend}
                size={"icon"}
                className={"bg-black hover:bg-violet-600"}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInputBox;
