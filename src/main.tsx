import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Analytics />
  </StrictMode>
);

// Ceedee, the animated CDS IGRL chat mascot (shared with the OS homepage; lives in public/os/buddy.js)
// (kept off the /mission dashboard, where it would cover the large buttons)
if (!window.location.pathname.startsWith("/mission")) {
  const buddy = document.createElement("script");
  buddy.src = "/os/buddy.js?v=1";
  buddy.defer = true;
  document.body.append(buddy);
}
