import * as React from "react";
import { FeaturesSection } from "my-v0-project";

// This section deliberately has no background of its own — it sits on the page
// canvas, alternating with the `bg-card` sections around it. Preview cards force
// a white body, so the canvas is supplied here or the headings render
// near-white on white.
export const Default = () => (
  <div style={{ background: "var(--background)", color: "var(--foreground)" }}>
    <FeaturesSection />
  </div>
);
