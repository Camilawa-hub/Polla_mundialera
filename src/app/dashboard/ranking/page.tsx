"use client"

import { usePuntajes } from "@/hooks/use-puntajes"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"
import { useSession } from "next-auth/react"

function getPositionIcon(pos: number) {
  switch (pos) {
    case 0:
      return <Trophy className="h-5 w-5 text-yellow-500" />
    case 1:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 2:
      return <Award className="h-5 w-5 text-amber-600" />
    default:
      return null
  }
}

export default function RankingPage() {
  const { data: session } = useSession()
  const { data: puntajes, isLoading } = usePuntajes()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ranking General</h1>
        <p className="text-muted-foreground">Tabla de posiciones de la Polla Mundial 2026</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clasificación</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Participante</TableHead>
                <TableHead className="text-right">Puntos</TableHead>
                <TableHead className="text-right hidden sm:table-cell">
                  Resultados Exactos
                </TableHead>
                <TableHead className="text-right hidden md:table-cell">
                  Ganadores Acertados
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {puntajes && puntajes.length > 0 ? (
                puntajes.map((p, index) => {
                  const isMe = p.usuarioId === session?.user?.id
                  return (
                    <TableRow
                      key={p.id}
                      className={isMe ? "bg-primary/5 font-medium" : ""}
                    >
                      <TableCell className="font-bold">
                        <div className="flex items-center gap-1">
                          {getPositionIcon(index)}
                          <span>{index + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{p.usuario?.nombre}</span>
                          {isMe && (
                            <span className="text-xs text-muted-foreground">(tú)</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {p.puntosTotales}
                      </TableCell>
                      <TableCell className="text-right hidden sm:table-cell">
                        {p.resultadosExactos}
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        {p.ganadoresAcertados}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay puntajes registrados aún
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
