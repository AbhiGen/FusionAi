import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import Image from "next/image"

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div classname="p-3">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo.svg"
                            alt="AiFusion"
                            width={60}
                            height={60}
                            className="w-[40px] h-[40px]"
                        />
                        <h2 className="font-bold text-xl">FusionAi</h2>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}