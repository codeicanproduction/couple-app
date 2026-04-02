'use client'

export default function PetSvgCat() {
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {/* Tail */}
      <path
        d="M94 118 Q124 96 112 66"
        stroke="#F0B080" strokeWidth="11" fill="none" strokeLinecap="round"
        className="animate-tail-sway origin-[94px_118px]"
      />
      {/* Body */}
      <ellipse cx="70" cy="96" rx="34" ry="30" fill="#F5C090" />
      {/* Belly */}
      <ellipse cx="70" cy="101" rx="22" ry="19" fill="#FFE8D0" opacity="0.65" />
      {/* Head */}
      <circle cx="70" cy="60" r="28" fill="#F5C090" />
      {/* Left Ear */}
      <polygon points="44,42 32,16 60,34" fill="#F5C090" />
      <polygon points="46,40 35,20 57,33" fill="#FFB0B0" opacity="0.55" />
      {/* Right Ear */}
      <polygon points="96,42 108,16 80,34" fill="#F5C090" />
      <polygon points="94,40 105,20 83,33" fill="#FFB0B0" opacity="0.55" />
      {/* Eye Left */}
      <g className="animate-eye-blink origin-[58px_58px]">
        <circle cx="58" cy="58" r="5.5" fill="#2D2424" />
        <circle cx="59.8" cy="56.2" r="2" fill="white" />
      </g>
      {/* Eye Right */}
      <g className="animate-eye-blink origin-[82px_58px]" style={{ animationDelay: '0.15s' }}>
        <circle cx="82" cy="58" r="5.5" fill="#2D2424" />
        <circle cx="83.8" cy="56.2" r="2" fill="white" />
      </g>
      {/* Nose */}
      <ellipse cx="70" cy="68" rx="4" ry="3" fill="#E07090" />
      {/* Mouth */}
      <path d="M66 71 Q70 75 74 71" stroke="#C05070" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* Whiskers Left */}
      <line x1="67" y1="68" x2="32" y2="64" stroke="#C0A090" strokeWidth="0.9" opacity="0.45" />
      <line x1="67" y1="68" x2="32" y2="70" stroke="#C0A090" strokeWidth="0.9" opacity="0.45" />
      <line x1="67" y1="67" x2="38" y2="61" stroke="#C0A090" strokeWidth="0.9" opacity="0.35" />
      {/* Whiskers Right */}
      <line x1="73" y1="68" x2="108" y2="64" stroke="#C0A090" strokeWidth="0.9" opacity="0.45" />
      <line x1="73" y1="68" x2="108" y2="70" stroke="#C0A090" strokeWidth="0.9" opacity="0.45" />
      <line x1="73" y1="67" x2="102" y2="61" stroke="#C0A090" strokeWidth="0.9" opacity="0.35" />
      {/* Blush */}
      <ellipse cx="52" cy="67" rx="7" ry="4.5" fill="#FFB0C0" opacity="0.32" />
      <ellipse cx="88" cy="67" rx="7" ry="4.5" fill="#FFB0C0" opacity="0.32" />
      {/* Collar */}
      <path d="M44 76 Q70 86 96 76" stroke="#F06B6B" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <circle cx="70" cy="83" r="4.5" fill="#E8C078" />
      <circle cx="70" cy="83" r="2.2" fill="#C8A040" />
      {/* Front paws */}
      <ellipse cx="50" cy="122" rx="11" ry="6.5" fill="#F0B080" />
      <ellipse cx="90" cy="122" rx="11" ry="6.5" fill="#F0B080" />
    </svg>
  )
}
