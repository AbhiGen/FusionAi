"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import AiModels from "../../shared/AiModel";
import { DefaultModel } from "../../shared/AiModelDef";
import Image from "next/image";
import { Lock, MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

// ✅ Firebase imports
import { db } from "@/config/FirebaseConfig";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";

const AiMultiModel = () => {
  const { user } = useUser();
  const [aimodel, setAiModels] = useState(AiModels);

  // ✅ Load saved selections for this user
  useEffect(() => {
    const loadSelections = async () => {
      if (!user) return;

      try {
        const userEmail = user.primaryEmailAddress.emailAddress;
        const userCollection = collection(db, "users", userEmail, "aiModelSelections");
        const querySnapshot = await getDocs(userCollection);

        const selections = {};
        querySnapshot.forEach((doc) => {
          selections[doc.id] = doc.data().selectedSubModel;
        });

        // Update local state with saved selections
        setAiModels((prev) =>
          prev.map((model) => {
            const saved = selections[model.model];
            return saved ? { ...model, selectedSubModel: saved } : model;
          })
        );

        console.log("✅ Loaded saved selections for user:", userEmail);
      } catch (error) {
        console.error("❌ Error loading user selections:", error);
      }
    };

    loadSelections();
  }, [user]);

  // ✅ Handle toggle
  const onToggleChange = (model, value) => {
    setAiModels((prev) =>
      prev.map((m) => (m.model === model ? { ...m, enable: value } : m))
    );
  };

  // ✅ Save selected model under the user's Firestore document
  const handleModelSelect = async (parentModel, selectedSubModelId) => {
    if (!user) {
      console.warn("⚠️ No user logged in — cannot save selection.");
      return;
    }

    try {
      const model = aimodel.find((m) => m.model === parentModel);
      const selectedSub = model.subModel.find((sub) => sub.id === selectedSubModelId);
      const userEmail = user.primaryEmailAddress.emailAddress;

      // Update local state for immediate feedback
      setAiModels((prev) =>
        prev.map((m) =>
          m.model === parentModel ? { ...m, selectedSubModel: selectedSub } : m
        )
      );

      // ✅ Save under user's document
      await setDoc(
        doc(db, "users", userEmail, "aiModelSelections", parentModel),
        {
          model: parentModel,
          selectedSubModel: {
            id: selectedSub.id,
            name: selectedSub.name,
            premium: selectedSub.premium,
          },
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      console.log(`✅ Saved ${parentModel}: ${selectedSub.name} for user ${userEmail}`);
    } catch (error) {
      console.error("❌ Error saving user model selection:", error);
    }
  };

  // ✅ Helpers for Free / Premium
  const getFreeSubModels = (model) => model.subModel.filter((sub) => !sub.premium);
  const getPremiumSubModels = (model) => model.subModel.filter((sub) => sub.premium);

  // ✅ Default dropdown name
  const getDefaultModelName = (aiModel) => {
    const defaultId = DefaultModel[aiModel.model]?.modelId;
    const foundSubModel = aiModel.subModel.find((sub) => sub.id === defaultId);
    return aiModel.selectedSubModel?.name || (foundSubModel ? foundSubModel.name : "Select Model");
  };

  return (
    <div className="flex flex-1 h-[75vh] border-b">
      {aimodel.map((model, index) => (
        <div
          key={model.model || index}
          className={`flex flex-col border-r h-full overflow-auto 
            ${model.enable ? "min-w-[350px]" : "w-[100px] flex-none"}`}
        >
          {/* Header */}
          <div className="flex w-full items-center justify-between p-4 border-b h-[70px]">
            <div className="flex items-center gap-4">
              <Image src={model.icon} alt={model.model} width={24} height={24} />

              {/* Dropdown */}
              {model.enable && (
                <Select
                  disabled={model.premium} // ✅ Disable entire select if model is premium
                  defaultValue={model.selectedSubModel?.id || DefaultModel[model.model]?.modelId}
                  onValueChange={(value) => handleModelSelect(model.model, value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={getDefaultModelName(model)} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* FREE MODELS */}
                    {getFreeSubModels(model).length > 0 && (
                      <SelectGroup>
                        <SelectLabel>Free</SelectLabel>
                        {getFreeSubModels(model).map((subModel) => (
                          <SelectItem key={subModel.id} value={subModel.id}>
                            {subModel.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}

                    {/* PREMIUM MODELS */}
                    {getPremiumSubModels(model).length > 0 && (
                      <SelectGroup>
                        <SelectLabel className="flex items-center gap-2 text-yellow-600">
                          Premium <Lock size={12} />
                        </SelectLabel>
                        {getPremiumSubModels(model).map((subModel) => (
                          <SelectItem key={subModel.id} value={subModel.id} disabled>
                            {subModel.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Toggle / Chat Icon */}
            <div>
              {model.enable ? (
                <Switch
                  checked={model.enable}
                  onCheckedChange={(v) => onToggleChange(model.model, v)}
                />
              ) : (
                <MessageSquare
                  className="cursor-pointer"
                  onClick={() => onToggleChange(model.model, true)}
                />
              )}
            </div>
          </div>

          {/* Premium overlay */}
          {model.premium && model.enable && (
            <div className="flex items-center justify-center h-full">
              <Button disabled>
                <Lock className="mr-2" /> Upgrade to Unlock
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AiMultiModel;
