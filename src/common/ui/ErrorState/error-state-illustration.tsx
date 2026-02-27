/** Illustration: error state — person slipping, wet floor (flat vector style) */
export const ErrorStateIllustration = ({ size = 160 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    {/* Wet floor sign (A-frame, pink) */}
    <path
      d="M118 88l12 24h-24l12-24z"
      fill="#E8A0BF"
      stroke="#d48aa8"
      strokeWidth="1.5"
    />
    <path
      d="M124 98l4 8h-8l4-8z"
      fill="#93B5C6"
    />
    <circle cx="124" cy="102" r="3" fill="white" />
    {/* Puddle */}
    <ellipse cx="72" cy="128" rx="28" ry="10" fill="#93B5C6" opacity="0.8" />
    {/* Slipping lines */}
    <path d="M58 120l6 4" stroke="#4C5270" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M62 124l8 2" stroke="#4C5270" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <path d="M68 126l6 0" stroke="#4C5270" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    {/* Person: leg in air */}
    <path d="M72 100v28" stroke="#4C5270" strokeWidth="4" strokeLinecap="round" />
    <path d="M88 118l-8 12" stroke="#4C5270" strokeWidth="3" strokeLinecap="round" />
    <path d="M72 96l16 -6" stroke="#E07C50" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M72 96l-4 -20" stroke="#93B5C6" strokeWidth="4" strokeLinecap="round" />
    {/* Body */}
    <path d="M68 76v20" stroke="#E07C50" strokeWidth="6" strokeLinecap="round" />
    <path d="M76 76v20" stroke="#E07C50" strokeWidth="6" strokeLinecap="round" />
    {/* Head */}
    <circle cx="72" cy="64" r="14" fill="#E8D5C4" />
    {/* X eyes */}
    <path d="M66 60l6 6M72 60l-6 6" stroke="#4C5270" strokeWidth="2" strokeLinecap="round" />
    <path d="M76 60l6 6M82 60l-6 6" stroke="#4C5270" strokeWidth="2" strokeLinecap="round" />
    {/* Open mouth */}
    <path d="M68 70c2 4 8 4 10 0" stroke="#4C5270" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Starburst (impact) */}
    <path d="M58 52l4 4-4 4 4 4" stroke="#93B5C6" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <path d="M72 38l0 8 0 8" stroke="#93B5C6" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
  </svg>
)
