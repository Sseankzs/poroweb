"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { GamesSection } from "@/components/games-section";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";


export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    avatarUrl: string;
  } | null>(null);
  const [subscribedGames, setSubscribedGames] = useState<string[]>([]);

  // Check for existing session on mount and after login redirect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:2000/me", {
          credentials: "include", // Important: send cookies with request
          mode: "cors", // Explicitly set CORS mode
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Auth response:", data); // Debug log
          
          if (data.user) {
            setIsLoggedIn(true);
            setUser({
              username: data.user.username,
              avatarUrl: data.user.avatar_url,
            });
            console.log("User set:", data.user); // Debug log
          }
        } else {
          console.log("Auth check returned status:", response.status);
        }
      } catch (error) {
        console.error("Auth check failed - This is likely a CORS issue.", error);
        console.log("Make sure your backend has CORS enabled with credentials support");
      }
    };

    checkAuth();
    
    // Also check auth when the window regains focus (after Discord redirect)
    const handleFocus = () => {
      checkAuth();
    };
    
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleLogin = async () => {
    // Redirect to Discord OAuth
    window.location.href = "http://localhost:2000/auth/discord/login";
  };

  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setSubscribedGames([]);
  };

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
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <HeroSection
        isLoggedIn={isLoggedIn}
        subscribedCount={subscribedGames.length}
        onLogin={handleLogin}
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
