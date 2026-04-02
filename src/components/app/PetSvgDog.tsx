'use client'

export default function PetSvgDog() {
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {/* Tail */}
      <path
        d="M100 100 Q130 70 120 50"
        stroke="#C89060" strokeWidth="10" fill="none" strokeLinecap="round"
        className="animate-tail-sway origin-[100px_100px]"
      />
      {/* Body */}
      <ellipse cx="70" cy="96" rx="36" ry="30" fill="#D4A060" />
      {/* Belly */}
      <ellipse cx="70" cy="102" rx="24" ry="20" fill="#F0D8B0" opacity="0.7" />
      {/* Head */}
      <circle cx="70" cy="58" r="30" fill="#D4A060" />
      {/* Left Ear (floppy) */}
      <ellipse cx="38" cy="48" rx="14" ry="22" fill="#B07840" transform="rotate(-15 38 48)" />
      <ellipse cx="38" cy="48" rx="10" ry="18" fill="#D4A060" transform="rotate(-15 38 48)" />
      {/* Right Ear (floppy) */}
      <ellipse cx="102" cy="48" rx="14" ry="22" fill="#B07840" transform="rotate(15 102 48)" />
      <ellipse cx="102" cy="48" rx="10" ry="18" fill="#D4A060" transform="rotate(15 102 48)" />
      {/* Eye Left */}
      <g className="animate-eye-blink origin-[58px_56px]">
        <circle cx="58" cy="56" r="6" fill="#2D2424" />
        <circle cx="60" cy="54" r="2.2" fill="white" />
      </g>
      {/* Eye Right */}
      <g className="animate-eye-blink origin-[82px_56px]" style={{ animationDelay: '0.15s' }}>
        <circle cx="82" cy="56" r="6" fill="#2D2424" />
        <circle cx="84" cy="54" r="2.2" fill="white" />
      </g>
      {/* Snout */}
      <ellipse cx="70" cy="68" rx="14" ry="10" fill="#F0D8B0" />
      {/* Nose */}
      <ellipse cx="70" cy="65" rx="5" ry="4" fill="#3D2D2D" />
      <ellipse cx="71" cy="64" rx="1.5" ry="1" fill="#5D4D4D" />
      {/* Mouth */}
      <path d="M64 70 Q70 76 76 70" stroke="#8B6050" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Tongue */}
      <ellipse cx="70" cy="76" rx="4" ry="5" fill="#F08080" />
      {/* Blush */}
      <ellipse cx="48" cy="66" rx="7" ry="4.5" fill="#FFB0C0" opacity="0.25" />
      <ellipse cx="92" cy="66" rx="7" ry="4.5" fill="#FFB0C0" opacity="0.25" />
      {/* Collar */}
      <path d="M42 78 Q70 90 98 78" stroke="#F06B6B" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <circle cx="70" cy="85" r="4.5" fill="#E8C078" />
      <circle cx="70" cy="85" r="2.2" fill="#C8A040" />
      {/* Front paws */}
      <ellipse cx="48" cy="122" rx="12" ry="7" fill="#C89060" />
      <ellipse cx="92" cy="122" rx="12" ry="7" fill="#C89060" />
    </svg>
  )
}
