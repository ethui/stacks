import { trackEvent as aptabaseTrackEvent, init } from "@aptabase/web";

let isInitialized = false;

export function initializeAnalytics() {
  const appKey = import.meta.env.VITE_APTABASE_APP_KEY;

  if (!appKey) {
    return;
  }

  try {
    init(appKey);
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize Aptabase:", error);
  }
}

export function trackEvent(
  event: string,
  properties?: Record<string, string | number>,
) {
  if (!isInitialized) {
    return;
  }

  try {
    aptabaseTrackEvent(event, properties);
  } catch (error) {
    console.error("Failed to track event:", error);
  }
}

export function trackPageView(page: string) {
  trackEvent("page_view", { page });
}
