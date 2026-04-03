interface EHShieldLogoProps {
  size?: number;
  className?: string;
}

export default function EHShieldLogo({
  size = 48,
  className = "",
}: EHShieldLogoProps) {
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Explore Holidays Shield Logo"
      className={className}
    >
      {/* Shield base shape */}
      <path
        d="M50 4 L92 20 L92 58 C92 84 72 104 50 116 C28 104 8 84 8 58 L8 20 Z"
        fill="#111111"
        stroke="#E00000"
        strokeWidth="3"
      />
      {/* Inner shield glow */}
      <path
        d="M50 12 L85 26 L85 58 C85 80 67 98 50 109 C33 98 15 80 15 58 L15 26 Z"
        fill="#0A0A0A"
        stroke="#E00000"
        strokeWidth="1"
        opacity="0.5"
      />
      {/* EH text */}
      <text
        x="50"
        y="74"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#F2F2F2"
        fontSize="36"
        fontFamily="'Bebas Neue', sans-serif"
        fontWeight="700"
        letterSpacing="2"
      >
        EH
      </text>
      {/* Red accent bar at bottom of shield */}
      <path
        d="M30 92 L70 92"
        stroke="#E00000"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
