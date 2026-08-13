import { SITE } from "@/lib/site";

/**
 * The masthead card: forest ground, sage type. Its own register, distinct from
 * the sage cards beneath it.
 */
export function Header() {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-4 sm:px-12">
      <div className="flex items-baseline gap-3">
        <span className="text-[0.8125rem] font-bold uppercase tracking-[0.14em]">
          Poro Bot
        </span>
        <span className="hidden text-[0.8125rem] opacity-70 sm:inline">
          — League patch notes
        </span>
      </div>

      <div className="flex items-center gap-5">
        <span className="hidden text-[0.8125rem] opacity-70 md:inline">
          Self-hosted · MIT
        </span>
        <a
          href={SITE.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-ground/45 px-3 py-1.5 text-[0.8125rem] font-bold uppercase tracking-[0.14em] transition-colors duration-200 hover:bg-ground hover:text-forest"
        >
          Source →
        </a>
      </div>
    </div>
  );
}
