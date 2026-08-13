import { Card } from "@/components/card";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { StatsCard } from "@/components/stats-card";
import { GamesSection } from "@/components/games-section";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";

/**
 * A hierarchical grid, not a stack. Cards differ in span, tone and corner
 * radius, so the page has a clear primary (the hero), secondaries (commands,
 * pipeline) and an accent (stats).
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-page px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto grid max-w-(--grid-max) grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-6">
        {/* Masthead — full width, shallow */}
        <Card tone="forest" radius="bar" className="lg:col-span-6">
          <Header />
        </Card>

        {/* Primary: the dominant card */}
        <Card id="top" tone="cream" radius="primary" className="lg:col-span-4">
          <HeroSection />
        </Card>

        {/* Accent: narrow, tall, loud, near-sharp */}
        <Card tone="peach" radius="accent" className="lg:col-span-2">
          <StatsCard />
        </Card>

        {/* Secondary: commands, full width so the player has room */}
        <Card id="games" tone="cream" radius="primary" className="lg:col-span-6">
          <GamesSection />
        </Card>

        {/* Secondary: the pipeline */}
        <Card id="features" tone="sage" radius="primary" className="lg:col-span-6">
          <FeaturesSection />
        </Card>

        {/* Close */}
        <Card id="about" tone="forest" radius="bar" className="lg:col-span-6">
          <Footer />
        </Card>
      </div>
    </div>
  );
}
