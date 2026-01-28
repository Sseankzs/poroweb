"use client";

import React from "react"

import { GameCard } from "@/components/game-card";
import { useState } from "react";

interface Game {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}

const games: Game[] = [
  {
    id: "league",
    name: "League of Legends",
    category: "MOBA",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19 8v8l-7 3.5L5 16V8l7-3.5z" />
      </svg>
    ),
    description:
      "Champion updates, item changes, and ranked season announcements.",
  },
];

const categories = ["All", "MOBA"];

interface GamesSectionProps {
  isLoggedIn: boolean;
  subscribedGames: string[];
  onToggleSubscription: (gameId: string) => void;
}

export function GamesSection({
  isLoggedIn,
  subscribedGames,
  onToggleSubscription,
}: GamesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = games.filter((game) => {
    const matchesCategory =
      selectedCategory === "All" || game.category === selectedCategory;
    const matchesSearch = game.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="games" className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
              Supported Games
            </h2>
            <p className="text-muted-foreground">
              Choose the games you want to receive patch notifications for
            </p>
          </div>

          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-input pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring md:w-64"
            />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredGames.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                name={game.name}
                icon={game.icon}
                description={game.description}
                isSubscribed={subscribedGames.includes(game.id)}
                isLoggedIn={isLoggedIn}
                onToggle={onToggleSubscription}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
            <svg
              className="mb-4 h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-muted-foreground">No games found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
