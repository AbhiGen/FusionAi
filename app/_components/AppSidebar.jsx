"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Sun, Moon, Bolt, User2, LogOut, MessageSquare } from "lucide-react";
import Image from "next/image";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import UsageCreditProgress from "./UsageCreditProgress";

import { db } from "@/config/FirebaseConfig";
import { addDoc, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AiSelectedModelContext } from "@/context/AiSelectedModels";

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { isLoaded, isSignedIn, user } = useUser();

  // Consume context with fallback
  const context = useContext(AiSelectedModelContext);
  const {
    currentChatId = null,
    setCurrentChatId = () => console.warn("setCurrentChatId not available"),
    setMessages = () => console.warn("setMessages not available"),
  } = context || {};

  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);

  // 🔹 Load existing chats from Firestore
  useEffect(() => {
    const loadChats = async () => {
      if (!user) return;
      try {
        const userEmail = user.primaryEmailAddress.emailAddress;
        const chatCollection = collection(db, "users", userEmail, "chats");
        const chatDocs = await getDocs(chatCollection);

        const loadedChats = [];
        chatDocs.forEach((docSnap) => {
          loadedChats.push({ id: docSnap.id, ...docSnap.data() });
        });

        loadedChats.sort((a, b) => b.createdAt - a.createdAt);
        setChats(loadedChats);
      } catch (err) {
        console.error("❌ Error loading chats:", err);
        setError("Failed to load chats. Please try again.");
      }
    };

    loadChats();
  }, [user]);

  // 🆕 Start a new chat with a meaningful title
  const handleNewChat = async () => {
    if (!user) return alert("Please sign in first.");
    if (!context) {
      console.error("❌ AiSelectedModelContext is not provided");
      setError("Application error: Context not found. Please refresh the page.");
      return;
    }

    try {
      const userEmail = user.primaryEmailAddress.emailAddress;
      const timestamp = new Date().toLocaleString();
      const chatCount = chats.length + 1;
      const chatTitle = `Chat #${chatCount} - ${timestamp}`;

      const chatData = {
        createdAt: Date.now(),
        title: chatTitle,
        messages: {},
      };

      // Create new Firestore chat doc
      const newChatRef = await addDoc(
        collection(db, "users", userEmail, "chats"),
        chatData
      );

      // Reset all model conversations
      setMessages({});
      setCurrentChatId(newChatRef.id);

      // Dispatch clear event
      window.dispatchEvent(new Event("clearAllModelChats"));

      setChats((prev) => [{ id: newChatRef.id, ...chatData }, ...prev]);
      console.log("✅ New chat started:", newChatRef.id);
    } catch (err) {
      console.error("❌ Error creating new chat:", err);
      setError("Failed to create new chat. Please try again.");
    }
  };

  // 🔹 Load previous chat by ID
  const loadChat = async (chatId) => {
    if (!user) return alert("Please sign in first.");
    if (!context) {
      console.error("❌ AiSelectedModelContext is not provided");
      setError("Application error: Context not found. Please refresh the page.");
      return;
    }

    try {
      const userEmail = user.primaryEmailAddress.emailAddress;
      const chatDocRef = doc(db, "users", userEmail, "chats", chatId);
      const chatSnap = await getDoc(chatDocRef);

      if (chatSnap.exists()) {
        const chatData = chatSnap.data();
        setCurrentChatId(chatId);
        setMessages(chatData.messages || {});
        console.log("✅ Loaded previous chat:", chatId);
        setError(null);
      } else {
        console.log("❌ Chat not found in DB");
        setError("Chat not found.");
      }
    } catch (err) {
      console.error("❌ Error loading chat:", err);
      setError("Failed to load chat. Please try again.");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="FusionAi" width={40} height={40} />
              <h2 className="font-bold text-xl">FusionAi</h2>
            </div>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </div>

          {/* New Chat Button */}
          <Button onClick={handleNewChat} className="mt-7 w-full">
            + New Chat
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="p-3">
            <h2 className="font-bold text-lg mb-2">Chats</h2>
            {error && (
              <p className="text-red-500 text-sm mb-2">{error}</p>
            )}
            {!isSignedIn && (
              <p className="text-sm text-gray-400">
                Sign in to start a new chat
              </p>
            )}
            {isSignedIn && chats.length > 0 ? (
              <div className="space-y-2">
                {chats.map((chat) => (
                  <Button
                    key={chat.id}
                    variant={chat.id === currentChatId ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm truncate"
                    onClick={() => loadChat(chat.id)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {chat.title || "Untitled Chat"}
                  </Button>
                ))}
              </div>
            ) : (
              isSignedIn && (
                <p className="text-gray-400 text-sm">No chats yet</p>
              )
            )}
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-3 mb-10">
          {!isLoaded ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : !isSignedIn ? (
            <SignInButton>
              <Button className="w-full" size="lg">
                Sign In / Sign Up
              </Button>
            </SignInButton>
          ) : (
            <div>
              <UsageCreditProgress />
              <Button className="w-full mb-3">
                <Bolt /> Upgrade Plan
              </Button>
              <Button className="flex w-full mb-3" variant="ghost" size="lg">
                <User2 />
                <h2 className="ml-2">Settings</h2>
              </Button>
              <SignOutButton>
                <Button className="flex w-full" variant="ghost" size="lg">
                  <LogOut />
                  <h2 className="ml-2">Sign Out</h2>
                </Button>
              </SignOutButton>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;