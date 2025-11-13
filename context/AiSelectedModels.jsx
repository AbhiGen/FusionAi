"use client";

import React, { createContext, useState } from "react";

export const AiSelectedModelContext = createContext();

export const AiSelectedModelProvider = ({ children }) => {
  const [selectedModels, setSelectedModels] = useState({});
  const [messages, setMessages] = useState({});
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  return (
    <AiSelectedModelContext.Provider
      value={{
        selectedModels,
        setSelectedModels,
        messages,
        setMessages,
        chats,
        setChats,
        currentChatId,
        setCurrentChatId,
      }}
    >
      {children}
    </AiSelectedModelContext.Provider>
  );
};