"use client"

import { useEstadisticas } from "@/hooks/use-estadisticas"
import { usePuntajes } from "@/hooks/use-puntajes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export default function AdminEstadisticasPage() {
  const { data: estadisticas, isLoading } = useEstadisticas()
  const { data: puntajes, isLoading: loadingPuntajes } = usePuntajes()
  const [recalculando, setRecalculando] = useState(false)

  async function handleRecalcular() {
    setRecalculando(true)
    try {
      const res = await fetch("/api/recalcular", { method: "POST" })
      if (!res.ok) throw new Error("Error")
      toast.success("Puntajes recalculados")
      window.location.reload()
    } catch {
      toast.error("Error al recalcular")
    } finally {
      setRecalculando(false)
    }
  }

  if (isLoading || loadingPuntajes) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Estadísticas</h1>
          <p className="text-muted-foreground">Métricas generales de la Polla</p>
        </div>
        <Button onClick={handleRecalcular} disabled={recalculando} variant="outline">
          {recalculando ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Recalcular Puntajes
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ranking General</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Pts</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Exactos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {puntajes && puntajes.length > 0 ? (
                  puntajes.slice(0, 10).map((p, i) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-bold">{i + 1}</TableCell>
                      <TableCell>{p.usuario?.nombre}</TableCell>
                      <TableCell className="text-right font-bold">{p.puntosTotales}</TableCell>
                      <TableCell className="text-right hidden sm:table-cell">
                        {p.resultadosExactos}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      Sin datos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aciertos por Usuario</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Exactos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estadisticas?.aciertosPorUsuario && estadisticas.aciertosPorUsuario.length > 0 ? (
                  estadisticas.aciertosPorUsuario.map((u) => (
                    <TableRow key={u.usuarioId}>
                      <TableCell>{u.nombre}</TableCell>
                      <TableCell className="text-right">{u.total}</TableCell>
                      <TableCell className="text-right">{u.exactos}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                      Sin datos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Partidos Más Acertados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partido</TableHead>
                  <TableHead className="text-right">Aciertos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estadisticas?.partidosMasAcertados && estadisticas.partidosMasAcertados.length > 0 ? (
                  estadisticas.partidosMasAcertados.map((p, i) => (
                    <TableRow key={p.partidoId}>
                      <TableCell>
                        <span className="text-sm">{p.equipos}</span>
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-500">
                        {p.aciertos}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                      Sin datos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partidos Más Fallados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partido</TableHead>
                  <TableHead className="text-right">Fallos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estadisticas?.partidosMasFallados && estadisticas.partidosMasFallados.length > 0 ? (
                  estadisticas.partidosMasFallados.map((p, i) => (
                    <TableRow key={p.partidoId}>
                      <TableCell>
                        <span className="text-sm">{p.equipos}</span>
                      </TableCell>
                      <TableCell className="text-right font-bold text-red-500">
                        {p.fallos}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                      Sin datos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
