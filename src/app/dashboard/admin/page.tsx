"use client"

import { usePuntajes } from "@/hooks/use-puntajes"
import { usePartidos } from "@/hooks/use-partidos"
import { useUsuarios } from "@/hooks/use-usuarios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CalendarRange, Trophy, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const { data: puntajes } = usePuntajes()
  const { data: partidos } = usePartidos()
  const { data: usuarios } = useUsuarios()

  const stats = [
    {
      title: "Participantes",
      value: usuarios?.filter((u) => u.rol === "PARTICIPANTE").length ?? 0,
      icon: Users,
      href: "/dashboard/admin/usuarios",
      color: "text-blue-500",
    },
    {
      title: "Partidos",
      value: partidos?.length ?? 0,
      icon: CalendarRange,
      href: "/dashboard/admin/partidos",
      color: "text-green-500",
    },
    {
      title: "Finalizados",
      value: partidos?.filter((p) => p.estado === "FINALIZADO").length ?? 0,
      icon: Trophy,
      href: "/dashboard/admin/resultados",
      color: "text-yellow-500",
    },
    {
      title: "Puntaje Máximo",
      value: puntajes && puntajes.length > 0 ? puntajes[0].puntosTotales : 0,
      icon: BarChart3,
      href: "/dashboard/admin/estadisticas",
      color: "text-purple-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Panel de Administración</h1>
        <p className="text-muted-foreground">Gestiona la aplicación completa</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enlaces Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/dashboard/admin/usuarios"
              className="block p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-medium">Gestionar Usuarios</div>
              <div className="text-sm text-muted-foreground">
                Crear, editar o eliminar participantes
              </div>
            </Link>
            <Link
              href="/dashboard/admin/partidos"
              className="block p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-medium">Gestionar Partidos</div>
              <div className="text-sm text-muted-foreground">
                Crear o modificar partidos del mundial
              </div>
            </Link>
            <Link
              href="/dashboard/admin/resultados"
              className="block p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-medium">Ingresar Resultados</div>
              <div className="text-sm text-muted-foreground">
                Registrar marcadores oficiales
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top 3 Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            {puntajes && puntajes.length > 0 ? (
              <div className="space-y-3">
                {puntajes.slice(0, 3).map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                      </span>
                      <span>{p.usuario?.nombre}</span>
                    </div>
                    <span className="font-bold">{p.puntosTotales} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No hay datos aún</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
