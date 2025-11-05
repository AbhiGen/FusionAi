"use client";

import React, { useEffect } from "react";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";

// 🧩 Firebase imports
import { db } from "@/config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

function AppProviders({ children }) {
  const { user } = useUser();
  

  useEffect(() => {
    const createNewUser = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.primaryEmailAddress.emailAddress);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.fullName,
            email: user.primaryEmailAddress.emailAddress,
            createdAt: new Date(),
            remainingMsg: 5,
            plan: "Free",
            credits: 100,
          });
          console.log("✅ New user created in Firestore");
        } else {
          console.log("ℹ️ Existing user detected");
        }
      } catch (error) {
        console.error("❌ Firestore error:", error);
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

export default function Provider({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppProviders>{children}</AppProviders>
      </NextThemesProvider>
    </ClerkProvider>
  );
}
