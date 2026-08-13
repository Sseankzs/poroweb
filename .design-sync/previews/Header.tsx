import * as React from "react";
import { Header } from "my-v0-project";

// Header is position:fixed — a transform on the wrapper creates a containing
// block so it lays out inside the card instead of escaping to the viewport.
// The background is the DS's own canvas token: cards force a white body, and
// the header is deliberately translucent over it.
export const Default = () => (
  <div
    style={{
      position: "relative",
      height: 72,
      transform: "translateZ(0)",
      background: "var(--background)",
    }}
  >
    <Header />
  </div>
);
