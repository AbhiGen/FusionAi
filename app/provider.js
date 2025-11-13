"use client";

import React, { useEffect, useState } from "react";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";

// 🧠 Context for managing selected AI models
import { AiSelectedModelContext } from "@/context/AiSelectedModels";
import { DefaultModel } from "@/shared/AiModelDef";

// 🔥 Firebase imports
import { db } from "@/config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

/* --------------------------------------------------
   🧩 AiModelProvider – Context provider for model selection
-------------------------------------------------- */
const AiModelProvider = ({ children }) => {
  const [selectedModels, setSelectedModels] = useState(DefaultModel);
  const [messages, setMessages] = useState({}); // Updated to object
  const [currentChatId, setCurrentChatId] = useState(null); // Added currentChatId
  const [chats, setChats] = useState([]); // Added chats for consistency

  return (
    <AiSelectedModelContext.Provider
      value={{
        selectedModels,
        setSelectedModels,
        messages,
        setMessages,
        currentChatId,
        setCurrentChatId,
        chats,
        setChats,
      }}
    >
      {children}
    </AiSelectedModelContext.Provider>
  );
};

/* --------------------------------------------------
   🧩 AppProviders – Handles user creation in Firestore
-------------------------------------------------- */
function AppProviders({ children }) {
  const { user } = useUser();

  useEffect(() => {
    const createNewUser = async () => {
      if (!user) return;

      try {
        // ✅ Correct Firestore path
        const userEmail = user.primaryEmailAddress?.emailAddress;
        if (!userEmail) return;

        const userRef = doc(db, "users", userEmail);
        const userSnap = await getDoc(userRef);

        // ✅ Create user document only if it doesn’t exist
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.fullName,
            email: userEmail,
            createdAt: new Date(),
            remainingMsg: 5,
            plan: "Free",
            credits: 100,
          });
          console.log("✅ New user created in Firestore:", userEmail);
        } else {
          console.log("ℹ️ Existing user detected:", userEmail);
        }
      } catch (error) {
        console.error("❌ Firestore error while creating user:", error);
      }
    };

    createNewUser();
  }, [user]);

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <AppHeader />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

/* --------------------------------------------------
   🧩 Root Provider – Combines Clerk, Themes, and Contexts
-------------------------------------------------- */
export default function Provider({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AiModelProvider>
          <AppProviders>{children}</AppProviders>
        </AiModelProvider>
      </NextThemesProvider>
    </ClerkProvider>
  );
}