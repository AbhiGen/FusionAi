import React, { useState } from 'react'
import AiModels from '../../shared/AiModel'
import { DefaultModel } from '../../shared/AiModelDef' // ✅ Import your default model mapping
import Image from 'next/image'
import { Lock, MessageSquare } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

const AiMultiModel = () => {
  const [aimodel, setAiModels] = useState(AiModels)

  const onToggleChange = (model, value) => {
    setAiModels((prev) =>
      prev.map((m) =>
        m.model === model ? { ...m, enable: value } : m
      )
    )
  }

  // Separate Free and Premium sub-models
  const getFreeSubModels = (model) => model.subModel.filter(sub => !sub.premium)
  const getPremiumSubModels = (model) => model.subModel.filter(sub => sub.premium)

  // ✅ Function to get the default model name from DefaultModel
  const getDefaultModelName = (aiModel) => {
    const defaultId = DefaultModel[aiModel.model]?.modelId
    const foundSubModel = aiModel.subModel.find(sub => sub.id === defaultId)
    return foundSubModel ? foundSubModel.name : "Select Model"
  }

  return (
    <div className="flex flex-1 h-[75vh] border-b">
      {aimodel.map((model, index) => (
        <div
          key={model.model || index}
          className={`flex flex-col border-r h-full overflow-auto 
            ${model.enable ? 'min-w-[350px]' : 'w-[100px] flex-none'}`}
        >
          {/* Header Section */}
          <div className="flex w-full items-center justify-between p-4 border-b h-[70px]">
            <div className="flex items-center gap-4">
              <Image
                src={model.icon}
                alt={model.model}
                width={24}
                height={24}
              />

              {/* Dropdown Only When Enabled */}
              {model.enable && (
                <Select defaultValue={DefaultModel[model.model]?.modelId}>
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

          {/* Premium Model Overlay */}
          {model.premium && model.enable && (
            <div className="flex items-center justify-center h-full">
              <Button>
                <Lock className="mr-2" /> Upgrade to Unlock
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default AiMultiModel
