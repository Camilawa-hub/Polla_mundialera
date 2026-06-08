"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { LogOut, Menu, Trophy } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SidebarContent } from "./sidebar"
import { useAppStore } from "@/store/app-store"

export function Navbar() {
  const { data: session } = useSession()
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        <Sheet>
          <SheetTrigger>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="p-6 border-b">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Polla Mundial
              </h2>
            </div>
            <SidebarContent />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 font-semibold">
          <Trophy className="h-5 w-5 text-yellow-500 hidden md:block" />
          <span className="hidden md:block">Polla Mundial 2026</span>
        </div>

        <div className="flex-1" />

        {session?.user && (
          <span className="text-sm text-muted-foreground hidden sm:block">
            {session.user.nombre}
          </span>
        )}

        <ThemeToggle />

        {session?.user && (
          <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  )
}
