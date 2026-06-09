import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

type PartidoSeed = {
  local: string
  visitante: string
  fecha: string
  grupo: string
}

function partidosGrupo(
  grupo: string,
  eq1: string, eq2: string, eq3: string, eq4: string,
  ...fechas: [string, string, string, string, string, string]
): PartidoSeed[] {
  return [
    { local: eq1, visitante: eq2, fecha: fechas[0], grupo },
    { local: eq3, visitante: eq4, fecha: fechas[1], grupo },
    { local: eq1, visitante: eq3, fecha: fechas[2], grupo },
    { local: eq4, visitante: eq2, fecha: fechas[3], grupo },
    { local: eq1, visitante: eq4, fecha: fechas[4], grupo },
    { local: eq2, visitante: eq3, fecha: fechas[5], grupo },
  ]
}

async function main() {
  console.log("Limpiando base de datos...")
  await prisma.prediccion.deleteMany()
  await prisma.puntaje.deleteMany()
  await prisma.partido.deleteMany()
  await prisma.usuario.deleteMany()

  console.log("Creando usuarios...")
  const passwordHash = await bcrypt.hash("Polla2026!", 10)

  await prisma.usuario.create({
    data: { nombre: "Administrador", username: "admin", passwordHash, rol: "ADMIN" },
  })

  const participantesData = [
    "Carlos Pérez", "María González", "José Martínez", "Ana López",
    "Luis Rodríguez", "Carmen Fernández", "Pedro Sánchez", "Rosa Vargas",
    "Diego Ramírez", "Sofía Torres",
  ]

  const participantes = []
  for (let i = 0; i < participantesData.length; i++) {
    const usuario = await prisma.usuario.create({
      data: {
        nombre: participantesData[i],
        username: `participante${i + 1}`,
        passwordHash,
        rol: "PARTICIPANTE",
      },
    })
    participantes.push(usuario)
  }

  console.log("Creando partidos del Mundial 2026 (fase de grupos)...")

  const partidosData: PartidoSeed[] = [
    ...partidosGrupo("A", "México", "Sudáfrica", "República de Corea", "República Checa",
      "2026-06-11T15:00:00-04:00", "2026-06-11T22:00:00-04:00",
      "2026-06-18T12:00:00-04:00", "2026-06-18T21:00:00-04:00",
      "2026-06-24T21:00:00-04:00", "2026-06-24T21:00:00-04:00",
    ),
    ...partidosGrupo("B", "Canadá", "Bosnia y Herzegovina", "Catar", "Suiza",
      "2026-06-12T15:00:00-04:00", "2026-06-13T15:00:00-04:00",
      "2026-06-18T15:00:00-04:00", "2026-06-18T18:00:00-04:00",
      "2026-06-24T15:00:00-04:00", "2026-06-24T15:00:00-04:00",
    ),
    ...partidosGrupo("C", "Brasil", "Marruecos", "Haití", "Escocia",
      "2026-06-13T18:00:00-04:00", "2026-06-13T21:00:00-04:00",
      "2026-06-19T18:00:00-04:00", "2026-06-19T21:00:00-04:00",
      "2026-06-24T18:00:00-04:00", "2026-06-24T18:00:00-04:00",
    ),
    ...partidosGrupo("D", "Estados Unidos", "Paraguay", "Australia", "Turquía",
      "2026-06-12T21:00:00-04:00", "2026-06-13T00:00:00-04:00",
      "2026-06-19T15:00:00-04:00", "2026-06-19T00:00:00-04:00",
      "2026-06-25T22:00:00-04:00", "2026-06-25T22:00:00-04:00",
    ),
    ...partidosGrupo("E", "Alemania", "Curazao", "Costa de Marfil", "Ecuador",
      "2026-06-14T13:00:00-04:00", "2026-06-14T19:00:00-04:00",
      "2026-06-20T16:00:00-04:00", "2026-06-20T22:00:00-04:00",
      "2026-06-25T16:00:00-04:00", "2026-06-25T16:00:00-04:00",
    ),
    ...partidosGrupo("F", "Países Bajos", "Japón", "Suecia", "Túnez",
      "2026-06-14T16:00:00-04:00", "2026-06-14T22:00:00-04:00",
      "2026-06-20T13:00:00-04:00", "2026-06-20T00:00:00-04:00",
      "2026-06-25T19:00:00-04:00", "2026-06-25T19:00:00-04:00",
    ),
    ...partidosGrupo("G", "Bélgica", "Egipto", "RI de Irán", "Nueva Zelanda",
      "2026-06-15T15:00:00-04:00", "2026-06-15T21:00:00-04:00",
      "2026-06-21T15:00:00-04:00", "2026-06-21T21:00:00-04:00",
      "2026-06-26T23:00:00-04:00", "2026-06-26T23:00:00-04:00",
    ),
    ...partidosGrupo("H", "España", "Cabo Verde", "Arabia Saudí", "Uruguay",
      "2026-06-15T12:00:00-04:00", "2026-06-15T18:00:00-04:00",
      "2026-06-21T12:00:00-04:00", "2026-06-21T18:00:00-04:00",
      "2026-06-26T20:00:00-04:00", "2026-06-26T20:00:00-04:00",
    ),
    ...partidosGrupo("I", "Francia", "Senegal", "Irak", "Noruega",
      "2026-06-16T15:00:00-04:00", "2026-06-16T18:00:00-04:00",
      "2026-06-22T17:00:00-04:00", "2026-06-22T20:00:00-04:00",
      "2026-06-26T15:00:00-04:00", "2026-06-26T15:00:00-04:00",
    ),
    ...partidosGrupo("J", "Argentina", "Argelia", "Austria", "Jordania",
      "2026-06-16T21:00:00-04:00", "2026-06-16T00:00:00-04:00",
      "2026-06-22T13:00:00-04:00", "2026-06-22T23:00:00-04:00",
      "2026-06-27T22:00:00-04:00", "2026-06-27T22:00:00-04:00",
    ),
    ...partidosGrupo("K", "Portugal", "RD de Congo", "Uzbekistán", "Colombia",
      "2026-06-17T13:00:00-04:00", "2026-06-17T22:00:00-04:00",
      "2026-06-23T13:00:00-04:00", "2026-06-23T22:00:00-04:00",
      "2026-06-27T19:30:00-04:00", "2026-06-27T19:30:00-04:00",
    ),
    ...partidosGrupo("L", "Inglaterra", "Croacia", "Ghana", "Panamá",
      "2026-06-17T16:00:00-04:00", "2026-06-17T19:00:00-04:00",
      "2026-06-23T16:00:00-04:00", "2026-06-23T19:00:00-04:00",
      "2026-06-27T17:00:00-04:00", "2026-06-27T17:00:00-04:00",
    ),
  ]

  for (const p of partidosData) {
    await prisma.partido.create({
      data: {
        equipoLocal: p.local,
        equipoVisitante: p.visitante,
        fechaHora: new Date(p.fecha),
        fase: "GRUPOS",
        grupo: p.grupo,
      },
    })
  }

  console.log(`Total partidos creados: ${partidosData.length}`)

  console.log("Creando puntajes iniciales...")
  for (const p of participantes) {
    await prisma.puntaje.create({
      data: { usuarioId: p.id, puntosTotales: 0, resultadosExactos: 0, ganadoresAcertados: 0 },
    })
  }

  console.log("\nSeed completado exitosamente!")
  console.log("\nCredenciales de acceso:")
  console.log("  Admin: usuario=admin / contraseña=Polla2026!")
  for (let i = 0; i < participantesData.length; i++) {
    console.log(`  ${participantesData[i]}: usuario=participante${i+1} / contraseña=Polla2026!`)
  }
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
