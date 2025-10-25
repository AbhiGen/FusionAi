"use client"
import { Button } from '@/components/ui/button'
import { Mic, Paperclip, Send } from 'lucide-react'
import React from 'react'
import AiMultiModels from './AiMultiModel'
const ChatInputBox = () => {
  return (
    <div className='relative min-h-screen'>
        
      <div>
            <AiMultiModels/>
      </div>

      <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4'>
        <div className='w-full border rounded-xl shadow-md max-w-2xl p-4'>
            <input type="text" placeholder="Ask me anything..." className='border-0 outline-none w-full'/>
            <div className='mt-3 flex justify-between items-center'>
                <Button className={''} variant={'ghost'} size={'icon'}>
                    <Paperclip className='h-5 w-5'/>
                </Button>
                <div>
                    <Button variant={'ghost'} size={'icon'} className={'mr-2'}><Mic className='h-5 w-5'></Mic></Button>
                    <Button size={'icon'} className={'bg-violet-500 hover:bg-violet-600'}><Send className='h-5 w-5'></Send></Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInputBox
