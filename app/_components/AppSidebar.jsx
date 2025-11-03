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
import { Sun, Moon, Bolt, User2, LogOut } from "lucide-react";
import Image from "next/image";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import UsageCreditProgress from "@/components/UsageCreditProgress"; // ✅ Import added

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-3">
          <div className="flex justify-between items-center">
            {/* Logo + Title */}
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="AiFusion" width={40} height={40} />
              <h2 className="font-bold text-xl">FusionAi</h2>
            </div>

            {/* Dark/Light toggle button */}
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </div>

          <Button className="mt-7 w-full">+ New Chat</Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="p-3">
            <h2 className="font-bold text-lg">Chat</h2>
            <p className="text-sm text-gray-400">Sign in to start a new chat</p>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-3 mb-10">
          {!user ? (
            <SignInButton>
              <Button className="w-full" size="lg">
                Sign In / Sign Up
              </Button>
            </SignInButton>
          ) : (
            <div>
              {/* ✅ Progress bar visible only after sign-in */}
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
