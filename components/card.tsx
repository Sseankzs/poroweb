import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tone = "cream" | "sage" | "peach" | "steel" | "forest";

/**
 * Corner softness follows the card's role, so mixed radii read as hierarchy
 * rather than as inconsistency:
 *   primary — the big content cards
 *   bar     — full-width structural bars (masthead, footer)
 *   accent  — small, dense, near-sharp cards
 */
export type Radius = "primary" | "bar" | "accent";

const RADII: Record<Radius, string> = {
  primary: "rounded-(--radius-primary)",
  bar: "rounded-(--radius-bar)",
  accent: "rounded-(--radius-accent)",
};

interface CardProps {
  children: ReactNode;
  tone?: Tone;
  radius?: Radius;
  className?: string;
  id?: string;
}

const TONES: Record<Tone, string> = {
  cream: "tone-cream",
  sage: "tone-sage",
  peach: "tone-peach",
  steel: "tone-steel",
  forest: "tone-forest",
};

export function Card({
  children,
  tone = "cream",
  radius = "primary",
  className,
  id,
}: CardProps) {
  return (
    <section
      id={id}
      className={cn(
        TONES[tone],
        RADII[radius],
        "relative flex flex-col overflow-hidden bg-ground text-text",
        className
      )}
      style={{ boxShadow: "var(--card-shadow)" }}
    >

      <div className="relative flex h-full flex-col">{children}</div>
    </section>
  );
}
