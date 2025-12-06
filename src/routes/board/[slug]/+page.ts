import { getEntry } from "$lib/storage";
import type { Board } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, params }) => {
  const root = (await parent()).root;
  const board = await getEntry<Board>(root, `boards/${params.slug}.peridot`);
  return { board };
};
