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
import {
  Sun,
  Moon,
  Bolt,
  User2,
  LogOut,
  MessageSquare,
  MoreVertical,
  Trash,
  Edit3,
} from "lucide-react";
import Image from "next/image";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import UsageCreditProgress from "./UsageCreditProgress";

import { db } from "@/config/FirebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AiSelectedModelContext } from "@/context/AiSelectedModels";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { isSignedIn, user } = useUser();

  const context = useContext(AiSelectedModelContext);

  const {
    currentChatId = null,
    setCurrentChatId = () => {},
    setMessages = () => {},
  } = context || {};

  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);

  /* --------------------------------------------- */
  /* LOAD CHATS */
  /* --------------------------------------------- */
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
        setError("Failed to load chats. Try again.");
      }
    };

    loadChats();
  }, [user]);

  /* --------------------------------------------- */
  /* NEW CHAT */
  /* --------------------------------------------- */
  const handleNewChat = async () => {
    if (!isSignedIn || !user) {
      alert("Sign in first.");
      return;
    }

    try {
      const userEmail = user.primaryEmailAddress.emailAddress;

      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const chatData = {
        createdAt: Date.now(),
        title: `New Chat (${timestamp})`,
        messages: {},
      };

      const newChatRef = await addDoc(
        collection(db, "users", userEmail, "chats"),
        chatData
      );

      setMessages({});
      setCurrentChatId(newChatRef.id);
      window.dispatchEvent(new Event("clearAllModelChats"));

      setChats((prev) => [{ id: newChatRef.id, ...chatData }, ...prev]);
      setError(null);
    } catch (err) {
      console.error("❌ Error creating chat:", err);
      setError("Could not create chat.");
    }
  };

  /* --------------------------------------------- */
  /* LOAD CHAT */
  /* --------------------------------------------- */
  const loadChat = async (chatId) => {
    if (!isSignedIn || !user) {
      alert("Sign in first.");
      return;
    }

    try {
      const userEmail = user.primaryEmailAddress.emailAddress;
      const ref = doc(db, "users", userEmail, "chats", chatId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const chatData = snap.data();
        setCurrentChatId(chatId);
        setMessages(chatData.messages || {});
      } else {
        setError("Chat not found.");
      }
    } catch (err) {
      console.error("❌ Load chat error:", err);
    }
  };

  /* --------------------------------------------- */
  /* DELETE CHAT */
  /* --------------------------------------------- */
  const deleteChat = async (chatId) => {
    if (!user) return;
    const confirmDelete = confirm("Delete this chat?");
    if (!confirmDelete) return;

    try {
      const userEmail = user.primaryEmailAddress.emailAddress;
      await deleteDoc(doc(db, "users", userEmail, "chats", chatId));

      setChats((prev) => prev.filter((c) => c.id !== chatId));

      if (currentChatId === chatId) {
        setMessages({});
        setCurrentChatId(null);
      }
    } catch (err) {
      console.error("❌ Error deleting chat:", err);
    }
  };

  /* --------------------------------------------- */
  /* RENAME CHAT */
  /* --------------------------------------------- */
  const renameChat = async (chatId, oldTitle) => {
    const newTitle = prompt("Enter new chat title", oldTitle);

    if (!newTitle || newTitle.trim() === "") return;

    try {
      const userEmail = user.primaryEmailAddress.emailAddress;
      const ref = doc(db, "users", userEmail, "chats", chatId);
      await updateDoc(ref, { title: newTitle });

      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, title: newTitle } : c))
      );
    } catch (err) {
      console.error("❌ Rename error:", err);
    }
  };

  /* --------------------------------------------- */
  /* COMPONENT */
  /* --------------------------------------------- */
  return (
    <Sidebar className="flex flex-col">
      <SidebarHeader>
        <div className="p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="FusionAi" width={40} height={40} />
              <h2 className="font-bold text-xl">FusionAi</h2>
            </div>

            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </div>

          <Button onClick={handleNewChat} className="mt-7 w-full">
            + New Chat
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-grow overflow-y-auto">
        <SidebarGroup>
          <div className="px-3 pb-3">
            <h2 className="font-bold text-lg mb-2">Chats</h2>

            {isSignedIn && chats.length > 0 ? (
              <div className="space-y-1 mt-2">
                {chats.map((chat) => (
<div
  key={chat.id}
  className={`
    flex items-center justify-between rounded-md px-2 py-2 cursor-pointer transition
    ${
      currentChatId === chat.id
        ? "bg-gray-100 hover:bg-gray-200/70 dark:hover:bg-gray-700/60"
        : "hover:bg-gray-50 dark:hover:bg-gray-500/50"
    }
  `}
>
                    <div
                      onClick={() => loadChat(chat.id)}
                      className="flex items-center gap-2 truncate flex-1"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="truncate">{chat.title}</span>
                    </div>

                    {/* 3-dot menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 opacity-70 hover:opacity-100" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => renameChat(chat.id, chat.title)}
                          className="cursor-pointer"
                        >
                          <Edit3 className="mr-2 w-4 h-4" /> Rename
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => deleteChat(chat.id)}
                          className="cursor-pointer text-red-600"
                        >
                          <Trash className="mr-2 w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            ) : (
              isSignedIn && <p className="text-gray-400 text-sm">No chats yet</p>
            )}
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-3 mb-4">
          {isSignedIn ? (
            <div className="space-y-3">
              <UsageCreditProgress />

              <Button className="w-full mb-2 py-2 text-sm">
                <Bolt /> Upgrade
              </Button>

              <Button className="flex w-full" variant="ghost" size="sm">
                <User2 />
                <span className="ml-2">Settings</span>
              </Button>

              <SignOutButton>
                <Button className="flex w-full" variant="ghost" size="sm">
                  <LogOut />
                  <span className="ml-2">Sign Out</span>
                </Button>
              </SignOutButton>
            </div>
          ) : (
            <SignInButton>
              <Button className="w-full py-2 text-sm">
                Sign In / Sign Up
              </Button>
            </SignInButton>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
