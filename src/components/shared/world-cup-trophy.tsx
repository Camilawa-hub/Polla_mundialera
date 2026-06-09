interface WorldCupTrophyProps {
  className?: string
  size?: number
}

export function WorldCupTrophy({ className = "", size = 120 }: WorldCupTrophyProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Base - malaquita verde */}
      <rect x="30" y="100" width="60" height="6" rx="2" fill="#2d5a27" />
      <rect x="35" y="96" width="50" height="4" rx="1" fill="#3a7a33" />

      {/* Soporte inferior */}
      <path d="M45 96 L48 80 L72 80 L75 96" fill="#c4a44a" stroke="#a8842e" strokeWidth="1" />

      {/* Asta */}
      <rect x="57" y="50" width="6" height="30" rx="2" fill="#d4b85a" />

      {/* Copa principal */}
      <path
        d="M35 50 Q35 25 45 20 L45 20 Q48 35 50 38 L50 38 Q55 42 60 42 Q65 42 70 38 L70 38 Q72 35 75 20 L75 20 Q85 25 85 50 L85 50 Q78 56 60 56 Q42 56 35 50Z"
        fill="#e8c84a"
        stroke="#c4a44a"
        strokeWidth="1.5"
      />

      {/* Detalle superior de la copa */}
      <path
        d="M38 48 Q38 30 46 24"
        fill="none"
        stroke="#d4b85a"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M82 48 Q82 30 74 24"
        fill="none"
        stroke="#d4b85a"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Borde superior */}
      <ellipse cx="60" cy="22" rx="16" ry="4" fill="#f0d85a" stroke="#c4a44a" strokeWidth="1" />

      {/* El mundo - esfera */}
      <circle cx="60" cy="37" r="7" fill="#4a90d9" stroke="#3a70b0" strokeWidth="0.8" />
      <path d="M54 34 Q60 38 66 34" fill="none" stroke="#3a70b0" strokeWidth="0.8" />
      <path d="M54 40 Q60 36 66 40" fill="none" stroke="#3a70b0" strokeWidth="0.8" />
      <path d="M57 31 L57 43" fill="none" stroke="#3a70b0" strokeWidth="0.8" />
      <path d="M63 31 L63 43" fill="none" stroke="#3a70b0" strokeWidth="0.8" />

      {/* Figuras de atletas */}
      <path d="M42 28 Q44 18 48 14" fill="none" stroke="#d4b85a" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="48" cy="12" r="2.5" fill="#e8c84a" />
      <path d="M78 28 Q76 18 72 14" fill="none" stroke="#d4b85a" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="72" cy="12" r="2.5" fill="#e8c84a" />

      {/* Brazos de atletas */}
      <path d="M44 20 L38 26" fill="none" stroke="#d4b85a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M76 20 L82 26" fill="none" stroke="#d4b85a" strokeWidth="1.5" strokeLinecap="round" />

      {/* Brillo */}
      <path d="M50 30 Q55 28 60 30" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
      <ellipse cx="55" cy="46" rx="12" ry="3" fill="white" opacity="0.08" />

      {/* Detalles ornamentales en la base */}
      <circle cx="48" cy="92" r="1.2" fill="#d4b85a" />
      <circle cx="60" cy="91" r="1.2" fill="#d4b85a" />
      <circle cx="72" cy="92" r="1.2" fill="#d4b85a" />
    </svg>
  )
}
