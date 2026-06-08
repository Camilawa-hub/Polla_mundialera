"use client"

import { useSession } from "next-auth/react"
import { usePartidos } from "@/hooks/use-partidos"
import { usePredicciones } from "@/hooks/use-predicciones"
import { PrediccionCard } from "@/components/predicciones/prediccion-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { partidoBloqueado } from "@/lib/utils"

export default function PrediccionesPage() {
  const { data: session } = useSession()
  const { data: partidos, isLoading: loadingPartidos } = usePartidos()
  const { data: predicciones, isLoading: loadingPreds } = usePredicciones()
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("pendientes")

  if (loadingPartidos || loadingPreds) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const ahora = new Date()

  const partidosConPrediccion = partidos?.map((p) => ({
    ...p,
    prediccion: predicciones?.find(
      (pr) => pr.partidoId === p.id && pr.usuarioId === session?.user?.id
    ),
  })) ?? []

  const filtrados = partidosConPrediccion.filter((p) => {
    const matchSearch =
      p.equipoLocal.toLowerCase().includes(search.toLowerCase()) ||
      p.equipoVisitante.toLowerCase().includes(search.toLowerCase())

    const esPendiente = new Date(p.fechaHora) > ahora && p.estado !== "FINALIZADO"
    const esFuturo = tab === "pendientes" ? esPendiente : !esPendiente

    return matchSearch && esFuturo
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Predicciones</h1>
        <p className="text-muted-foreground">
          Ingresa tus pronósticos para los partidos del Mundial
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar equipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full">
          <TabsTrigger value="pendientes" className="flex-1">
            Pendientes ({partidosConPrediccion.filter((p) => new Date(p.fechaHora) > ahora && p.estado !== "FINALIZADO").length})
          </TabsTrigger>
          <TabsTrigger value="finalizados" className="flex-1">
            Finalizados ({partidosConPrediccion.filter((p) => new Date(p.fechaHora) <= ahora || p.estado === "FINALIZADO").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes" className="mt-4">
          {filtrados.length > 0 ? (
            <div className="grid gap-4">
              {filtrados.map((partido) => (
                <PrediccionCard
                  key={partido.id}
                  partido={partido}
                  prediccion={partido.prediccion}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No hay partidos pendientes con ese filtro
            </div>
          )}
        </TabsContent>

        <TabsContent value="finalizados" className="mt-4">
          {filtrados.length > 0 ? (
            <div className="grid gap-4">
              {filtrados.map((partido) => (
                <PrediccionCard
                  key={partido.id}
                  partido={partido}
                  prediccion={partido.prediccion}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No hay partidos finalizados con ese filtro
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
