"use client";

import React from "react"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GameCardProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isSubscribed: boolean;
  isLoggedIn: boolean;
  onToggle: (id: string) => void;
}

export function GameCard({
  id,
  name,
  icon,
  description,
  isSubscribed,
  isLoggedIn,
  onToggle,
}: GameCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-lg border border-border bg-card p-6 transition-all duration-200",
        isSubscribed && "border-accent/50 bg-accent/5",
        !isSubscribed && "hover:border-muted-foreground/30"
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-foreground">
          {icon}
        </div>
        {isSubscribed && (
          <span className="flex items-center gap-1 rounded-full bg-accent/20 px-2 py-1 text-xs font-medium text-accent">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Subscribed
          </span>
        )}
      </div>

      <h3 className="mb-2 text-lg font-semibold tracking-tight">{name}</h3>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <Button
        variant={isSubscribed ? "outline" : "default"}
        className={cn(
          "w-full",
          isSubscribed
            ? "border-accent/50 text-accent hover:bg-accent/10 hover:text-accent"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        disabled={!isLoggedIn}
        onClick={() => onToggle(id)}
      >
        {!isLoggedIn
          ? "Login to Subscribe"
          : isSubscribed
            ? "Unsubscribe"
            : "Subscribe"}
      </Button>
    </div>
  );
}
