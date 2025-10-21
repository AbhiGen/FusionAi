import React from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";

function Provider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"        // uses class for Tailwind dark mode
      defaultTheme="system"    // respect system preference
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}  {/* Render your app here! */}
    </NextThemesProvider>
  );
}

export default Provider;
