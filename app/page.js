import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (

    
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Welcome to FusionAI</h1>
        <Button>subscribe</Button>
      </div>

  )
}