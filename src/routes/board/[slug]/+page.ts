import { getEntry } from "$lib/storage";
import type { Board } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, params }) => {
  const root = (await parent()).root;
  const board = await getEntry<Board>(root, `boards/${params.slug}.peridot`);

  if (!board) {
    error(404, { message: `board not found: ${params.slug}` });
  }

  return { board };
};
