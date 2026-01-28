"use client";

import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  isLoggedIn: boolean;
  subscribedCount: number;
  onLogin: () => void;
}

export function HeroSection({
  isLoggedIn,
  subscribedCount,
  onLogin,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background pt-32 pb-20">
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-muted-foreground">
              Real-time patch notifications
            </span>
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">
            Never miss a
            <span className="text-accent"> patch note </span>
            again
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Subscribe to your favorite games and get instant summaries when
            new updates drop.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {!isLoggedIn ? (
              <Button
                size="lg"
                onClick={onLogin}
                className="flex items-center gap-2 bg-[#5865F2] px-8 text-white hover:bg-[#4752C4]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
                </svg>
                Connect Discord
              </Button>
            ) : (
              <a
                href="#games"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse Games
              </a>
            )}
            <a
              href="#features"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-8 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Learn More
            </a>
          </div>

          {isLoggedIn && subscribedCount > 0 && (
            <p className="mt-6 text-sm text-muted-foreground">
              You're subscribed to{" "}
              <span className="font-medium text-accent">{subscribedCount}</span>{" "}
              {subscribedCount === 1 ? "game" : "games"}
            </p>
          )}
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-12">
          <div className="text-center">
            <p className="text-3xl font-bold tracking-tight">50+</p>
            <p className="mt-1 text-sm text-muted-foreground">Games Tracked</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold tracking-tight">10K+</p>
            <p className="mt-1 text-sm text-muted-foreground">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold tracking-tight">{"<"}5min</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Notification Delay
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
