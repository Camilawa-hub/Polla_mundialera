"use client"

import { useSession } from "next-auth/react"
import { usePuntajes } from "@/hooks/use-puntajes"
import { usePartidos } from "@/hooks/use-partidos"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatFechaCorta, partidoBloqueado } from "@/lib/utils"
import { Trophy, Target, Users, Clock, ArrowUp, ArrowDown } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: puntajes, isLoading: loadingPuntajes } = usePuntajes()
  const { data: partidos, isLoading: loadingPartidos } = usePartidos()

  if (loadingPuntajes || loadingPartidos) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const miPuntaje = puntajes?.find((p) => p.usuarioId === session?.user?.id)
  const miPosicion = puntajes?.findIndex((p) => p.usuarioId === session?.user?.id) ?? -1
  const ahora = new Date()

  const proximosPartidos = partidos
    ?.filter((p) => new Date(p.fechaHora) > ahora)
    .slice(0, 5)

  const ultimosResultados = partidos
    ?.filter((p) => p.estado === "FINALIZADO")
    .slice(-5)
    .reverse()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Bienvenido, {session?.user?.nombre}
        </h1>
        <p className="text-muted-foreground">Panel de control de la Polla Mundial 2026</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mi Puntaje</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{miPuntaje?.puntosTotales ?? 0}</div>
            <p className="text-xs text-muted-foreground">puntos totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Posición</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {miPosicion >= 0 ? `#${miPosicion + 1}` : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              de {puntajes?.length ?? 0} participantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exactos</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{miPuntaje?.resultadosExactos ?? 0}</div>
            <p className="text-xs text-muted-foreground">resultados exactos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ganadores</CardTitle>
            <ArrowDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{miPuntaje?.ganadoresAcertados ?? 0}</div>
            <p className="text-xs text-muted-foreground">ganadores acertados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Próximos Partidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {proximosPartidos && proximosPartidos.length > 0 ? (
              <div className="space-y-3">
                {proximosPartidos.map((partido) => (
                  <div
                    key={partido.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex-1">
                      <span className="font-medium">{partido.equipoLocal}</span>
                      <span className="text-muted-foreground mx-1">vs</span>
                      <span className="font-medium">{partido.equipoVisitante}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          partidoBloqueado(partido.fechaHora) ? "secondary" : "outline"
                        }
                      >
                        {partidoBloqueado(partido.fechaHora) ? "🔒" : "⏳"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatFechaCorta(partido.fechaHora)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay próximos partidos</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Últimos Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ultimosResultados && ultimosResultados.length > 0 ? (
              <div className="space-y-3">
                {ultimosResultados.map((partido) => (
                  <div key={partido.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{partido.equipoLocal}</span>
                      <span className="text-lg font-bold mx-2">
                        {partido.golesLocal} - {partido.golesVisitante}
                      </span>
                      <span className="font-medium">{partido.equipoVisitante}</span>
                    </div>
                    <Separator className="mt-2" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay resultados aún</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
