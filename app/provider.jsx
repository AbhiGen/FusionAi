import React from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
<<<<<<< HEAD
import { Sidebar } from 'lucide-react';
import { SidebarProvider,SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/AppSidebar';
=======
>>>>>>> 97fbbf3803668f1e1dcc94b1cdff6c23202483e0

function Provider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"        // uses class for Tailwind dark mode
      defaultTheme="system"    // respect system preference
      enableSystem
      disableTransitionOnChange
      {...props}
    >
<<<<<<< HEAD
      <SidebarProvider>
        <SidebarTrigger />
        <AppSidebar />
          {children}  {/* Render your app here! */}
      </SidebarProvider>
=======
      {children}  {/* Render your app here! */}
>>>>>>> 97fbbf3803668f1e1dcc94b1cdff6c23202483e0
    </NextThemesProvider>
  );
}

export default Provider;
