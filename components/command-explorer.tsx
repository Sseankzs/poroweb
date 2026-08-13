"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Each command carries its own screen recording. Selecting one swaps the
 * player, so every command is demonstrable in a single panel's worth of space
 * — rather than one GIF that can only show one of them.
 *
 * MP4 rather than GIF deliberately: the sources are 60fps, which GIF cannot
 * represent (100/60 = 1.67 centiseconds per frame, so it rounds and plays
 * slow). These are ~0.5 MB each; the same clips as GIF would be 10-20x larger.
 */
const COMMANDS = [
  {
    index: "01",
    name: "/counter",
    args: "<champion> [lane]",
    blurb:
      "Which champions beat the one you name, with win rates and sample sizes.",
    clip: "counter",
    caption: "Any spelling works — nunu, Nunu & Willump, chogath",
  },
  {
    index: "02",
    name: "/recentupdates",
    args: "<champion>",
    blurb:
      "Every recent change to a champion, straight from the database with no AI call.",
    clip: "recent_updates",
    caption: "Answered from SQLite — no model call",
  },
  {
    index: "03",
    name: "/get_latest_patch",
    args: "",
    blurb:
      "The current patch: an AI summary grouped into buffs, nerfs and mixed.",
    clip: "get_latest_patch",
    caption: "One Claude Haiku call per patch, never per request",
  },
  {
    index: "04",
    name: "/subscribe",
    args: "[#channel]",
    blurb:
      "Point a channel at patch notifications. New patches arrive within hours.",
    clip: "subscribe",
    caption: "Requires Manage Channels",
  },
];

export function CommandExplorer() {
  const [active, setActive] = useState(0);
  const selected = COMMANDS[active];

  return (
    // The clips are 2:3 portrait — cropped to the Discord response itself — so
    // the player runs taller than the list. The list takes the wider column and
    // is centred, which keeps the two sides balanced.
    <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
      <ul className="flex flex-col">
        {COMMANDS.map((command, i) => {
          const isActive = i === active;
          return (
            <li key={command.name} className={i > 0 ? "rule-t" : undefined}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={cn(
                  "grid w-full grid-cols-[2.5rem_1fr] gap-4 py-5 text-left transition-opacity duration-200",
                  !isActive && "opacity-50 hover:opacity-80"
                )}
              >
                <span className="meta pt-1.5">— {command.index}</span>
                <span>
                  <span className="flex flex-wrap items-baseline gap-x-2.5">
                    <code className="font-mono text-xl font-light tracking-tight sm:text-2xl">
                      {command.name}
                    </code>
                    {command.args && (
                      <code className="meta font-mono">{command.args}</code>
                    )}
                  </span>
                  <span className="mt-1.5 block max-w-[42ch] text-sm leading-relaxed">
                    {command.blurb}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <figure className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-(--radius-inner) border border-rule-strong">
          {/* key forces a remount so the clip restarts when you switch command */}
          <video
            key={selected.clip}
            className="block w-full"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={`/showcase/${selected.clip}.jpg`}
            aria-label={`${selected.name} running in Discord`}
          >
            <source src={`/showcase/${selected.clip}.mp4`} type="video/mp4" />
          </video>
        </div>
        <figcaption className="meta flex items-baseline justify-between gap-4">
          <span>{selected.caption}</span>
          <code className="font-mono">{selected.name}</code>
        </figcaption>
      </figure>
    </div>
  );
}
