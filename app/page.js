"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme } = useTheme();
  return (

    
      <div>
        <h1>Welcome to FusionAI</h1>
        <Button>subscribe</Button>
        <Button onClick={() => setTheme("light")}>Light</Button>
        <Button onClick={() => setTheme("dark")}>Dark</Button>
        <Button onClick={() => setTheme("system")}>System</Button>
      </div>

  )
}