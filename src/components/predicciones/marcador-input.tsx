"use client"

import { Input } from "@/components/ui/input"

interface MarcadorInputProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  label: string
}

export function MarcadorInput({ value, onChange, disabled, label }: MarcadorInputProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Input
        type="number"
        min={0}
        max={99}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-16 h-12 text-center text-lg font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  )
}
