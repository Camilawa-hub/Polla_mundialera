"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  ListChecks,
  History,
  Users,
  CalendarRange,
  BarChart3,
  Settings,
} from "lucide-react"
import { WorldCupTrophy } from "@/components/shared/world-cup-trophy"

const participanteLinks = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/predicciones", label: "Predicciones", icon: ListChecks },
  { href: "/dashboard/ranking", label: "Ranking", icon: WorldCupTrophy },
  { href: "/dashboard/historial", label: "Historial", icon: History },
]

const adminLinks = [
  { href: "/dashboard/admin", label: "Panel Admin", icon: Settings },
  { href: "/dashboard/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/dashboard/admin/partidos", label: "Partidos", icon: CalendarRange },
  { href: "/dashboard/admin/resultados", label: "Resultados", icon: ListChecks },
  { href: "/dashboard/admin/estadisticas", label: "Estadísticas", icon: BarChart3 },
]

export function SidebarContent() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.rol === "ADMIN"

  return (
    <nav className="flex-1 p-4 space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
        Participante
      </p>
      {participanteLinks.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        )
      })}

      {isAdmin && (
        <>
          <div className="pt-4 pb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
              Administración
            </p>
          </div>
          {adminLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </>
      )}
    </nav>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-card">
      <div className="p-6 border-b">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <WorldCupTrophy size={24} className="text-yellow-500" />
          Polla Mundial
        </h2>
      </div>
      <SidebarContent />
    </aside>
  )
}
