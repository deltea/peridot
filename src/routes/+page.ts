import { createDirectory, getEntries, getEntry } from "$lib/storage";
import type { Board } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
  const root = (await parent()).root;

  const boards: Board[] = [];
  let entries = await getEntries(root, "boards") as string[];
  if (!entries) {
    await createDirectory(root, "boards");
    entries = await getEntries(root, "boards") as string[];
  }

  await Promise.all(
    entries.map(async (entry) => {
      const board = await getEntry<Board>(root, `boards/${entry}`);
      if (board) boards.push(board);
    })
  );

  return { boards };
};
