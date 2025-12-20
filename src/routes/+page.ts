import { createDirectory, getEntries, getEntry } from "$lib/storage";
import type { Board } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
  const root = (await parent()).root;

  const boards: Board[] = [];
  const entries = await getEntries(root, "boards") as string[];
  if (!entries) {
    await createDirectory(root, "boards");
  }

  await Promise.all(
    entries.map(async (entry) => {
      const board = await getEntry<Board>(root, `boards/${entry}`);
      if (board) boards.push(board);
    })
  );

  return { boards };
};
