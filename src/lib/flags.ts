const banderasCodigo: Record<string, string> = {
  "México": "mx",
  "Sudáfrica": "za",
  "República de Corea": "kr",
  "República Checa": "cz",
  "Canadá": "ca",
  "Bosnia y Herzegovina": "ba",
  "Catar": "qa",
  "Suiza": "ch",
  "Brasil": "br",
  "Marruecos": "ma",
  "Haití": "ht",
  "Escocia": "gb-sct",
  "Estados Unidos": "us",
  "Paraguay": "py",
  "Australia": "au",
  "Turquía": "tr",
  "Alemania": "de",
  "Curazao": "cw",
  "Costa de Marfil": "ci",
  "Ecuador": "ec",
  "Países Bajos": "nl",
  "Japón": "jp",
  "Suecia": "se",
  "Túnez": "tn",
  "Bélgica": "be",
  "Egipto": "eg",
  "RI de Irán": "ir",
  "Nueva Zelanda": "nz",
  "España": "es",
  "Cabo Verde": "cv",
  "Arabia Saudí": "sa",
  "Uruguay": "uy",
  "Francia": "fr",
  "Senegal": "sn",
  "Irak": "iq",
  "Noruega": "no",
  "Argentina": "ar",
  "Argelia": "dz",
  "Austria": "at",
  "Jordania": "jo",
  "Portugal": "pt",
  "RD de Congo": "cd",
  "Uzbekistán": "uz",
  "Colombia": "co",
  "Inglaterra": "gb-eng",
  "Croacia": "hr",
  "Ghana": "gh",
  "Panamá": "pa",
}

export function getFlagUrl(pais: string): string | null {
  const codigo = banderasCodigo[pais]
  if (!codigo) return null
  return `https://flagcdn.com/20x15/${codigo}.png`
}

export const banderas: Record<string, string> = Object.fromEntries(
  Object.entries(banderasCodigo).map(([pais]) => [pais, ""])
)

export function getBandera(pais: string): string {
  return ""
}

export const equipos = Object.keys(banderasCodigo).sort()
