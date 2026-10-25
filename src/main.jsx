import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { initAnalytics } from "./analytics.js";
import "./styles/global.css";

initAnalytics();

// one index.html serves every route, so point the canonical at this page's own
// path on the production host (search engines render JS before reading it)
const canonical = document.createElement("link");
canonical.rel = "canonical";
canonical.href = "https://openral.com" + (window.location.pathname.replace(/\/+$/, "") || "/");
document.head.append(canonical);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
