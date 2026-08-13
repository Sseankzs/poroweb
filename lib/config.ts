/**
 * Central place for runtime configuration pulled from environment variables.
 * Set NEXT_PUBLIC_API_URL in .env.local (dev) or your hosting platform (prod).
 *
 * The fallback to localhost means the app still works if someone forgets to
 * create .env.local, but you'll get a loud warning so it's obvious.
 */
if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    "[config] NEXT_PUBLIC_API_URL is not set — falling back to http://localhost:2000. " +
      "Copy .env.example to .env.local and fill in the value."
  );
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2000";
