import { SITE } from "@/lib/site";

export function HeroSection() {
  return (
    <div className="flex h-full flex-col justify-between gap-12 p-8 sm:p-14">
      <div className="flex items-start justify-between gap-6">
        <span className="tag">Open source</span>
        <span className="meta whitespace-nowrap">— 001</span>
      </div>

      <div>
        {/* Display type: light, tight, italic on the accent word. */}
        <h1 className="max-w-[15ch] text-[3rem] leading-[0.94] sm:text-[4.5rem] lg:text-[5.5rem]">
          League patch <em className="font-light italic">notes</em> without the
          reading
        </h1>

        <p className="mt-10 max-w-[44ch] text-lg leading-relaxed">
          Poro Bot reads every League of Legends patch, turns it into structured
          data, and posts a short summary to Discord — plus champion counter
          lookups on demand.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <a
          href={SITE.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-cream transition-opacity duration-200 hover:opacity-85"
        >
          View on GitHub →
        </a>
        <a
          href="#features"
          className="tag transition-opacity duration-200 hover:opacity-70"
        >
          How it works →
        </a>
      </div>
    </div>
  );
}
