import { Loader2 } from "lucide-react"
import { cn } from "@repo/services/utils"

export interface LoadingSpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string
}

export function LoadingSpinner({ className, size = 24, ...props }: LoadingSpinnerProps) {
  return (
    <Loader2
      size={size}
      className={cn("animate-spin text-muted-foreground", className)}
      {...props}
    />
  )
}
