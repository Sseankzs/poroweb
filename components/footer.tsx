import { SITE } from "@/lib/site";

const LINKS = [
  { label: "Source on GitHub", href: SITE.repo },
  { label: "Documentation", href: `${SITE.repo}#readme` },
  { label: "Self-hosting guide", href: `${SITE.repo}/blob/main/DEPLOY.md` },
];

export function Footer() {
  return (
    <div className="p-8 sm:p-14">
      <div>
        <div className="rule-t grid gap-12 pt-10 sm:grid-cols-2">
          <div>
            <p className="max-w-[38ch] text-2xl font-light leading-snug tracking-tight sm:text-3xl">
              A personal Discord bot for League of Legends patch notes.
            </p>
            <p className="meta mt-6 max-w-[44ch]">
              Built as a side project, released under the MIT licence — clone it
              and run your own.
            </p>
          </div>

          <nav className="flex flex-col gap-3 sm:items-end">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-light transition-opacity duration-200 hover:opacity-70"
              >
                {link.label} →
              </a>
            ))}
          </nav>
        </div>

        {/* Pagination dots + swipe cue, straight from the poster. */}
        <div className="rule-t mt-16 flex items-center justify-between pt-8">
          <div className="flex items-center gap-3" aria-hidden>
            <span className="size-3.5 rounded-full bg-ink" />
            <span className="size-3.5 rounded-full border border-ink" />
          </div>
          <a
            href="#top"
            className="meta transition-opacity duration-200 hover:opacity-70"
          >
            Back to top →
          </a>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="meta">
            © {new Date().getFullYear()} {SITE.name}. MIT licensed.
          </p>
          <p className="meta max-w-md sm:text-right">
            Not endorsed by Riot Games. Riot Games and all associated properties
            are trademarks or registered trademarks of Riot Games, Inc.
          </p>
        </div>
      </div>
    </div>
  );
}
