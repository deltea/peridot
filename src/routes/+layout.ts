import type { LayoutLoad } from "./$types";
import { dev } from "$app/environment";
import { injectAnalytics } from "@vercel/analytics/sveltekit";

injectAnalytics({ mode: dev ? "development" : "production" });

export const ssr = false;

export const load: LayoutLoad = async () => {
  const root = await navigator.storage.getDirectory();

	return { root };
};
