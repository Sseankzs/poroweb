import * as React from "react";
import { Button } from "my-v0-project";

// The DS is dark-only: its tokens live on :root and the app paints the canvas
// via `body`. Preview cards force a white body, so each cell supplies the real
// surface itself — otherwise `ghost`/`link` render near-white on white.
const Surface = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: "var(--background)",
      color: "var(--foreground)",
      padding: 24,
      borderRadius: 8,
    }}
  >
    {children}
  </div>
);

export const Variants = () => (
  <Surface>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      <Button>View source</Button>
      <Button variant="secondary">How it works</Button>
      <Button variant="outline">Learn more</Button>
      <Button variant="ghost">Dismiss</Button>
      <Button variant="link">Read the docs</Button>
      <Button variant="destructive">Unsubscribe</Button>
    </div>
  </Surface>
);

export const Sizes = () => (
  <Surface>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  </Surface>
);

const GitHubMark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.834 2.81 1.3 3.5.995.11-.775.42-1.3.76-1.6-2.67-.3-5.47-1.335-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0024 12.5C24 5.87 18.63.5 12 .5z" />
  </svg>
);

export const WithIcon = () => (
  <Surface>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      <Button>
        <GitHubMark />
        View on GitHub
      </Button>
      <Button variant="outline">
        <GitHubMark />
        Source
      </Button>
      <Button size="icon" aria-label="View on GitHub">
        <GitHubMark />
      </Button>
      <Button size="icon-sm" variant="ghost" aria-label="View on GitHub">
        <GitHubMark />
      </Button>
    </div>
  </Surface>
);

export const Disabled = () => (
  <Surface>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      <Button disabled>Subscribed</Button>
      <Button variant="secondary" disabled>
        Checking patches
      </Button>
      <Button variant="outline" disabled>
        Unavailable
      </Button>
    </div>
  </Surface>
);
