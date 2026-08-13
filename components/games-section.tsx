import { CommandExplorer } from "@/components/command-explorer";

export function GamesSection() {
  return (
    <div className="p-8 sm:p-14">
      <div className="flex items-baseline justify-between gap-6">
        <span className="tag-fill">Commands</span>
        <span className="meta">— 002</span>
      </div>

      <h2 className="mt-10 max-w-[14ch] text-[2.75rem] sm:text-[4rem]">
        What it does
      </h2>

      <p className="mt-6 max-w-[52ch] text-lg leading-relaxed">
        Everything runs through slash commands — no dashboard to log into, no
        account to create. Pick one to see what it sends back.
      </p>

      <div className="mt-12">
        <CommandExplorer />
      </div>

      <p className="meta mt-10">
        Currently tracks League of Legends. The schema supports more games.
      </p>
    </div>
  );
}
