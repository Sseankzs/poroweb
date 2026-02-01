"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { GamesSection } from "@/components/games-section";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";


export default function Home() {
  const { isLoggedIn, user, login, logout } = useAuth();
  const [subscribedGames, setSubscribedGames] = useState<string[]>([]);

  const handleToggleSubscription = (gameId: string) => {
    setSubscribedGames((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header
        isLoggedIn={isLoggedIn}
        username={user?.username}
        avatarUrl={user?.avatarUrl}
        onLogin={login}
        onLogout={logout}
      />

      <HeroSection
        isLoggedIn={isLoggedIn}
        subscribedCount={subscribedGames.length}
        onLogin={login}
      />

      <GamesSection
        isLoggedIn={isLoggedIn}
        subscribedGames={subscribedGames}
        onToggleSubscription={handleToggleSubscription}
      />

      <FeaturesSection />

      <Footer />
    </main>
  );
}
