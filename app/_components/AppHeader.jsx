"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const AppHeader = () => {
  return (
    <div
      className="p-3 shadow-sm flex justify-between items-center
                 bg-white dark:bg-black
                 text-gray-900 dark:text-white
                 border-b border-gray-200 dark:border-gray-800
                 max-w-full transition-colors duration-300"
    >
      <SidebarTrigger />
      
    </div>
  );
};

export default AppHeader;
