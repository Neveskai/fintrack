/** Illustration: empty state — folder with sad face + decorative blob (minimal flat style) */
export const EmptyStateIllustration = ({ size = 160 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    {/* Subtle background shapes */}
    <circle cx="24" cy="32" r="12" fill="currentColor" opacity="0.06" />
    <path d="M132 44l8 8-8 8" stroke="currentColor" strokeWidth="2" opacity="0.08" strokeLinecap="round" />
    <path d="M28 120l6-6 6 6" stroke="currentColor" strokeWidth="2" opacity="0.08" strokeLinecap="round" strokeLinejoin="round" />
    {/* Dark blob with speckles (starry feel) */}
    <path
      d="M92 28c8 0 16 4 20 12 6 10 4 22-2 30-4 6-10 10-18 12-10 2-20-2-26-10-4-6-6-14-4-22 2-8 8-14 16-18 6-2 10-2 14-4z"
      fill="#4C5270"
      opacity="0.9"
    />
    <circle cx="88" cy="42" r="1.5" fill="white" opacity="0.9" />
    <circle cx="98" cy="48" r="1" fill="white" opacity="0.7" />
    <circle cx="94" cy="58" r="1.2" fill="white" opacity="0.8" />
    <circle cx="82" cy="52" r="1" fill="white" opacity="0.6" />
    <circle cx="90" cy="62" r="0.8" fill="white" opacity="0.5" />
    {/* Folder body (light blue) */}
    <path
      d="M44 56h72c4 0 8 4 8 8v48c0 4-4 8-8 8H44c-4 0-8-4-8-8V64c0-4 4-8 8-8z"
      fill="#93B5C6"
    />
    {/* Folder flap */}
    <path
      d="M44 56l20-24h32c4 0 8 4 8 8v8H44V56z"
      fill="#BDD5EA"
    />
    {/* Sad face on folder */}
    <circle cx="72" cy="78" r="3" fill="#4C5270" />
    <circle cx="96" cy="78" r="3" fill="#4C5270" />
    <path d="M70 92c2 4 12 4 14 0" stroke="#4C5270" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
)
