import React, { useState } from 'react'
import AiModels from '../../shared/AiModel'
import Image from 'next/image'
import { Lock } from 'lucide-react'

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
import { MessageSquare } from 'lucide-react'
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

  return (
    <div className='flex flex-1 h-[75vh] border-b'>
      {aimodel.map((model, index) => (
        <div
          key={model.model || index}  // ✅ key fixed here
          className={`flex flex-col border-r h-full overflow-auto 
          ${model.enable ? 'min-w-[350px]' : 'w-[100px] flex-none'}`}  // ✅ removed extra colon
        >
          <div className='flex w-full items-center justify-between p-4 border-b h-[70px]'>
            <div className='flex items-center gap-4'>
              <Image
                src={model.icon}
                alt={model.model}
                width={24}
                height={24}
              />
              {model.enable && (
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={model.subModel[0].name} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {model.subModel.map((subModel, subIndex) => (
                        <SelectItem key={subModel.name} value={subModel.name}>
                          {subModel.name}
                        </SelectItem>
                      ))}
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              {model.enable ? (
                <Switch
                  checked={model.enable}
                  onCheckedChange={(v) => onToggleChange(model.model, v)}
                />
              ) : (
                <MessageSquare onClick={() => onToggleChange(model.model, true)} />
              )}
            </div>
          </div>
          {model.premium && model.enable && <div className='flex items-center justify-center h-full'>
              <Button><Lock/>Upgrade to Unlock</Button>
          </div>}
        </div>
      ))}
    </div>
  )
}

export default AiMultiModel
