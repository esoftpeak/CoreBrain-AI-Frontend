type LogoProps = {
  className?: string
}

/**
 * Temporary placeholder — swap `src` once the final logo is ready.
 */
export function Logo({ className = 'h-48 w-48' }: LogoProps) {
  return (
    <img
      src="/logo-placeholder.svg"
      alt="CoreBrain.ai"
      className={className}
      width={192}
      height={192}
    />
  )
}
