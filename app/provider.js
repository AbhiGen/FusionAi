"use client";
import React from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/AppSidebar';
import AppHeader from './_components/AppHeader';

function Provider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <SidebarProvider>
        {/* Full app layout with sidebar and main area */}
        <div className="flex w-full h-screen">
          
          {/* Sidebar (fixed width) */}
          <AppSidebar />

          {/* Main area: Header + Page Content */}
          <div className="flex flex-col flex-1">
            <AppHeader />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
          
        </div>
      </SidebarProvider>
    </NextThemesProvider>
  );
}

export default Provider;
