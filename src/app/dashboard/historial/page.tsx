"use client"

import { useSession } from "next-auth/react"
import { usePredicciones } from "@/hooks/use-predicciones"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatFechaCorta } from "@/lib/utils"

export default function HistorialPage() {
  const { data: session } = useSession()
  const { data: predicciones, isLoading } = usePredicciones({
    usuarioId: session?.user?.id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const historial = predicciones
    ?.filter((p) => p.partido?.estado === "FINALIZADO")
    .sort(
      (a, b) =>
        new Date(b.partido?.fechaHora ?? 0).getTime() -
        new Date(a.partido?.fechaHora ?? 0).getTime()
    )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Historial</h1>
        <p className="text-muted-foreground">
          Todos tus pronósticos y resultados obtenidos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mis Predicciones</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partido</TableHead>
                <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                <TableHead className="text-center">Predicción</TableHead>
                <TableHead className="text-center">Resultado</TableHead>
                <TableHead className="text-right">Pts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historial && historial.length > 0 ? (
                historial.map((pred) => {
                  const partido = pred.partido
                  return (
                    <TableRow key={pred.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">
                            {partido?.equipoLocal}
                          </div>
                          <div className="font-medium text-sm">
                            {partido?.equipoVisitante}
                          </div>
                          <div className="text-xs text-muted-foreground md:hidden mt-1">
                            {formatFechaCorta(partido?.fechaHora ?? "")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {formatFechaCorta(partido?.fechaHora ?? "")}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold text-lg">
                          {pred.golesLocalPredicho} - {pred.golesVisitantePredicho}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {partido?.golesLocal !== null ? (
                          <span className="font-bold text-lg">
                            {partido?.golesLocal} - {partido?.golesVisitante}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {pred.puntosObtenidos !== null ? (
                          <Badge
                            variant={
                              pred.puntosObtenidos === 4
                                ? "default"
                                : pred.puntosObtenidos >= 2
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {pred.puntosObtenidos === 4 && "🟢 "}
                            {pred.puntosObtenidos === 3 && "🟡 "}
                            {pred.puntosObtenidos === 2 && "🔵 "}
                            {pred.puntosObtenidos === 1 && "🔴 "}
                            +{pred.puntosObtenidos}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No tienes predicciones en partidos finalizados aún
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
