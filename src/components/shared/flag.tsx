import { getFlagUrl } from "@/lib/flags"

export function Flag({ pais, className = "" }: { pais: string; className?: string }) {
  const src = getFlagUrl(pais)
  if (!src) return <span className={`inline-block w-5 h-4 bg-muted rounded ${className}`} />
  return (
    <img
      src={src}
      alt={pais}
      className={`inline-block w-5 h-4 align-text-bottom ${className}`}
      loading="lazy"
    />
  )
}
