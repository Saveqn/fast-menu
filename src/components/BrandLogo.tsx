import { cn } from "@/lib/utils"

export function BrandLogo({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <span
      role="img"
      aria-label={alt}
      className={cn("inline-flex shrink-0 rounded-xl bg-white", className)}
      style={{
        backgroundImage: `url('${src}')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }}
    />
  )
}
