"use client"; // ✅ required since Progress uses Radix (client-side)

import React from "react";
import { Progress } from '@/components/ui/progress'; // ✅ import the Progress component

const UsageCreditProgress = () => {
  return (
    <div className="p-3 border rounded-2xl mb-5 flex flex-col gap-2">
      <h2 className="font-bold text-xl">Free plan</h2>
      <p className="text-gray-400">0/5 Messages Used</p>
      <Progress value={60} /> {/* ✅ corrected */}
    </div>
  );
};

export default UsageCreditProgress;
