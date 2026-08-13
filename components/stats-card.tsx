const STATS = [
  { value: "6h", label: "Patch check interval" },
  { value: "173", label: "Champions tracked" },
  { value: "MIT", label: "Open source" },
];

export function StatsCard() {
  return (
    <div className="flex h-full flex-col justify-between gap-8 p-8 sm:p-10">
      <span className="tag self-start">By the numbers</span>

      <dl className="flex flex-col gap-7">
        {STATS.map((stat, i) => (
          <div key={stat.label} className={i > 0 ? "rule-t pt-7" : undefined}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block text-5xl font-light leading-none tracking-tight sm:text-6xl">
                {stat.value}
              </span>
              <span className="meta mt-2 block">{stat.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
