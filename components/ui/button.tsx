import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Pill-shaped by default, no shadows, weight 600 only (the ladder is 400/600/700
// — 500 is deliberately absent). Depth comes from surface shifts and hairlines.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,color,border-color,opacity] duration-200 ease-out disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[1.05em] shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45 active:opacity-80",
  {
    variants: {
      variant: {
        // The single accent. Ink on coral is the only readable pairing.
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Quiet solid — the slate family.
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        // Hairline stroke, transparent ground.
        outline:
          "border border-border-strong bg-transparent text-foreground-strong hover:bg-sunken/70",
        ghost: "bg-transparent text-foreground-strong hover:bg-sunken/70",
        link: "bg-transparent text-foreground-strong underline underline-offset-4 decoration-[1.5px] decoration-primary hover:decoration-2",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-6 text-[0.95rem]",
        xs: "h-7 px-3 text-xs gap-1",
        sm: "h-9 px-4 text-sm gap-1.5",
        lg: "h-[3.25rem] px-8 text-base",
        icon: "size-11",
        "icon-xs": "size-7",
        "icon-sm": "size-9",
        "icon-lg": "size-[3.25rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
