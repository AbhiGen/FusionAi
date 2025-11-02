import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

const AppHeader = () => {
  return (
    <div className="p-3 shadow flex justify-between items-center bg-white max-w-full">
      <SidebarTrigger />
      <Button>Sign In</Button>
    </div>
  )
}

export default AppHeader
