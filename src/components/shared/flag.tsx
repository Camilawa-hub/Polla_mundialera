import { getBandera } from "@/lib/flags"

const imgFlags: Record<string, string> = {
  "Escocia": "https://hatscripts.github.io/circle-flags/flags/gb-sct.svg",
  "Inglaterra": "https://hatscripts.github.io/circle-flags/flags/gb-eng.svg",
}

export function Flag({ pais, className = "" }: { pais: string; className?: string }) {
  const imgUrl = imgFlags[pais]
  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={pais}
        className={`inline-block w-5 h-5 align-text-bottom ${className}`}
      />
    )
  }
  return <span className={className}>{getBandera(pais)}</span>
}
