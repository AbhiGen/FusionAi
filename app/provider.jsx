import React from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Sidebar } from 'lucide-react';
import { SidebarProvider,SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/AppSidebar';

function Provider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"        // uses class for Tailwind dark mode
      defaultTheme="system"    // respect system preference
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <SidebarProvider>
        <SidebarTrigger />
        <AppSidebar />
          {children}  {/* Render your app here! */}
      </SidebarProvider>
    </NextThemesProvider>
  );
}

export default Provider;
