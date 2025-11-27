import type { LayoutLoad } from "./$types";

export const ssr = false;

export const load: LayoutLoad = async () => {
  const root = await navigator.storage.getDirectory();

	return { root };
};
