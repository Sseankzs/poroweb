const STAGES = [
  {
    step: "01",
    title: "Read",
    description:
      "Firecrawl fetches the patch page as markdown. Nothing is interpreted yet.",
  },
  {
    step: "02",
    title: "Parse",
    description:
      "Markdown becomes rows — champion, ability, stat, old value, new value. Headings are checked against the live champion roster, so items and runes never leak in.",
  },
  {
    step: "03",
    title: "Summarise",
    description:
      "Those rows — never raw HTML — go to Claude Haiku once per patch. It returns a few short lines grouped into buffs, nerfs and mixed.",
  },
  {
    step: "04",
    title: "Post",
    description:
      "The summary and champion list go to every subscribed channel, within hours of the patch going live.",
  },
];

export function FeaturesSection() {
  return (
    <div className="p-8 sm:p-14">
      <div>
        <div className="rule-t flex items-baseline justify-between gap-6 pt-6">
          <span className="tag">Pipeline</span>
          <span className="meta">— 003</span>
        </div>

        <h2 className="mt-10 max-w-[14ch] text-[2.75rem] sm:text-[4.5rem]">
          How it works
        </h2>

        <p className="mt-8 max-w-[46ch] text-lg leading-relaxed">
          Four stages, each doing one job. The model only ever sees structured
          data — which is what makes champion lookups instant and exact.
        </p>

        {/* Numbered stages in a ruled grid. Cells divide with hairlines only. */}
        <ol className="mt-16 grid sm:grid-cols-2">
          {STAGES.map((stage, i) => (
            <li
              key={stage.step}
              className={[
                "rule-t py-10",
                i % 2 === 1 ? "sm:border-l sm:border-rule sm:pl-10" : "sm:pr-10",
              ].join(" ")}
            >
              <span className="meta">— {stage.step}</span>
              <h3 className="mt-4 text-3xl font-light tracking-tight sm:text-4xl">
                {stage.title}
              </h3>
              <p className="mt-4 max-w-[46ch] leading-relaxed">
                {stage.description}
              </p>
            </li>
          ))}
        </ol>

        <p className="rule-t mt-4 max-w-[52ch] pt-8 leading-relaxed">
          One Python process and a SQLite file. No database server, no
          dashboard, no privileged Discord intents — it fits on a free-tier VM.
        </p>
      </div>
    </div>
  );
}
