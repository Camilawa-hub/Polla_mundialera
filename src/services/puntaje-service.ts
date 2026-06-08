import { prisma } from "@/lib/prisma"

export function calcularPuntos(
  golesLocalPred: number,
  golesVisitantePred: number,
  golesLocalReal: number,
  golesVisitanteReal: number
): number {
  const exacto = golesLocalPred === golesLocalReal && golesVisitantePred === golesVisitanteReal
  if (exacto) return 4

  const diffPred = golesLocalPred - golesVisitantePred
  const diffReal = golesLocalReal - golesVisitanteReal

  if (diffPred === 0 && diffReal === 0) return 2
  if (Math.sign(diffPred) === Math.sign(diffReal) && diffPred !== 0) return 3

  return 1
}

export async function recalcularPuntajes() {
  const usuarios = await prisma.usuario.findMany({
    where: { rol: "PARTICIPANTE" },
    include: {
      predicciones: {
        where: { partido: { estado: "FINALIZADO" } },
        include: { partido: true },
      },
    },
  })

  for (const usuario of usuarios) {
    let puntosTotales = 0
    let resultadosExactos = 0
    let ganadoresAcertados = 0

    for (const pred of usuario.predicciones) {
      const partido = pred.partido
      if (partido.golesLocal === null || partido.golesVisitante === null) continue

      const puntos = calcularPuntos(
        pred.golesLocalPredicho,
        pred.golesVisitantePredicho,
        partido.golesLocal,
        partido.golesVisitante
      )

      await prisma.prediccion.update({
        where: { id: pred.id },
        data: { puntosObtenidos: puntos },
      })

      puntosTotales += puntos
      if (puntos === 4) resultadosExactos++
      if (puntos >= 3) ganadoresAcertados++
    }

    const partidosSinPrediccion = await prisma.partido.count({
      where: { estado: "FINALIZADO", id: { notIn: usuario.predicciones.map((p) => p.partidoId) } },
    })

    await prisma.puntaje.upsert({
      where: { usuarioId: usuario.id },
      update: { puntosTotales, resultadosExactos, ganadoresAcertados },
      create: { usuarioId: usuario.id, puntosTotales, resultadosExactos, ganadoresAcertados },
    })
  }
}

export async function recalcularPuntajesPartido(partidoId: string) {
  const partido = await prisma.partido.findUnique({
    where: { id: partidoId },
  })

  if (!partido || partido.golesLocal === null || partido.golesVisitante === null) return

  const predicciones = await prisma.prediccion.findMany({
    where: { partidoId },
  })

  for (const pred of predicciones) {
    const puntos = calcularPuntos(
      pred.golesLocalPredicho,
      pred.golesVisitantePredicho,
      partido.golesLocal,
      partido.golesVisitante
    )

    await prisma.prediccion.update({
      where: { id: pred.id },
      data: { puntosObtenidos: puntos },
    })
  }

  await recalcularPuntajes()
}
