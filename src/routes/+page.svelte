<script lang="ts">
  import "iconify-icon";
  import { getRelativeTime } from "$lib/utils.js";
  import { onMount } from "svelte";
  import type { Board } from "$lib/types";
  import { getEntries, getEntry, setEntry } from "$lib/storage.js";

  let { data } = $props();
  let boards: Board[] = $state([]);

  async function createBoard() {
    const newBoard: Board = {
      name: "yume_os",
      slug: `yume-os`,
      dateUpdated: new Date().toString(),
      dateCreated: new Date().toString(),
    }
    await setEntry(data.root, `boards/${newBoard.slug}.peridot`, newBoard);
    location.reload();
  }

  onMount(async () => {
    const entries = await getEntries(data.root, "boards");
    entries.forEach(async entry => {
      const board = await getEntry<Board>(data.root, `boards/${entry}`);
      boards = [...boards, board];
    });
  });
</script>

<div class="grid grid-cols-2 gap-4 w-xl h-fit">
  {#each boards as board}
    <a
      href={`/board/${board.slug}`}
      class="w-full aspect-square border-2 flex flex-col items-center justify-center border-muted hover:border-accent"
    >
      <header class="font-bold text-accent text-lg">{board.name}</header>
      <span class="text-sm text-fg mt-2">{getRelativeTime(board.dateUpdated)}</span>
    </a>
  {/each}

  <button
    onclick={createBoard}
    class="w-full aspect-square cursor-pointer border-2 flex gap-2 items-center justify-center border-muted hover:border-accent"
  >
    <header class="font-bold text-accent text-lg">+ CREATE BOARD</header>
  </button>
</div>
