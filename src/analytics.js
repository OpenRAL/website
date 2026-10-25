// PostHog product analytics (EU cloud). Autocapture records page views and every
// link/button click with its text, so new buttons are counted without wiring.
// Cookieless: persistence is in-memory only, so nothing is stored on the
// visitor's device and no consent banner is needed. The trade-off is that a
// returning visitor counts as a new one on each page load.
//
// Off unless VITE_POSTHOG_KEY is set at build time (local dev stays silent).
// The SDK is ~300 kB, so it loads in its own chunk after first paint; events
// fired before it arrives are queued.
const KEY = import.meta.env.VITE_POSTHOG_KEY;

let client = null;
const queue = [];

export function initAnalytics() {
  if (!KEY || typeof window === "undefined") return;
  import("posthog-js").then(({ default: posthog }) => {
    posthog.init(KEY, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com",
      persistence: "memory",
      person_profiles: "identified_only",
      disable_session_recording: true,
      disable_surveys: true,
    });
    client = posthog;
    queue.splice(0).forEach(([event, props]) => client.capture(event, props));
  });
}

// Named events for actions autocapture can't describe well. Never pass
// anything a visitor typed (name, email, message).
export function track(event, props) {
  if (!KEY) return;
  if (client) client.capture(event, props);
  else queue.push([event, props]);
}
