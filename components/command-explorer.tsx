"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { asset } from "@/lib/base-path";

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
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const activeRef = useRef(active);
  activeRef.current = active;

  // Every clip stays mounted, so switching is just a play/pause — nothing is
  // torn down, re-fetched, or re-laid-out. Restart from the top so a command
  // you return to plays from the beginning rather than mid-scroll.
  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        video.currentTime = 0;
        // Autoplay can still be refused; the poster stands in if it is.
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active]);

  // Buffer the unopened clips once the page has settled. Marking them all
  // preload="auto" up front would put ~2 MB on the critical path for clips
  // most visitors never reach.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      videos.current.forEach((video, i) => {
        if (!video || i === activeRef.current) return;
        video.preload = "auto";
        video.load();
      });
    }, 1500);
    return () => window.clearTimeout(timer);
  }, []);

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
        {/* The box holds the sources' own 366x540 ratio, so it keeps its height
            whether or not a clip has metadata yet — no collapse-and-jump on
            switch. The players are stacked inside it and cross-faded. */}
        <div className="relative aspect-366/540 overflow-hidden rounded-(--radius-inner) border border-rule-strong">
          {COMMANDS.map((command, i) => (
            <video
              key={command.clip}
              ref={(el) => {
                videos.current[i] = el;
              }}
              className={cn(
                "absolute inset-0 block h-full w-full object-cover transition-opacity duration-300",
                i === active ? "opacity-100" : "opacity-0"
              )}
              loop
              muted
              playsInline
              preload={i === 0 ? "auto" : "metadata"}
              poster={asset(`/showcase/${command.clip}.jpg`)}
              aria-hidden={i !== active}
              aria-label={`${command.name} running in Discord`}
            >
              <source src={asset(`/showcase/${command.clip}.mp4`)} type="video/mp4" />
            </video>
          ))}
        </div>
        <figcaption className="meta flex items-baseline justify-between gap-4">
          <span>{selected.caption}</span>
          <code className="font-mono">{selected.name}</code>
        </figcaption>
      </figure>
    </div>
  );
}
