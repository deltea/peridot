<script lang="ts">
  import "iconify-icon";
  import { getRelativeTime } from "$lib/utils.js";
  import { onMount } from "svelte";
  import type { Board } from "$lib/types";
  import { getEntries, getEntry, setEntry } from "$lib/storage.js";
  import { Dialog } from "bits-ui";

  let { data } = $props();
  let boards: Board[] = $state([]);
  let boardName: string = $state("");

  async function createBoard() {
    const newBoard: Board = {
      name: boardName || "new board",
      slug: boardName.toLowerCase().replace(/\s+/g, "-"),
      updatedAt: new Date().toString(),
      createdAt: new Date().toString(),
      pieces: []
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
      class="w-full aspect-square border-2 flex flex-col items-center justify-center border-border hover:border-accent relative"
    >
      <button aria-label="options" class="absolute top-2 right-1 p-1 cursor-pointer" onclick={(e: MouseEvent) => e.stopPropagation()}>
        <iconify-icon icon="mdi:dots-vertical" class="text-2xl"></iconify-icon>
      </button>
      <p class="font-bold text-accent text-xl">{board.name}</p>
      <span class="text-fg mt-2">{getRelativeTime(board.updatedAt)}</span>
    </a>
  {/each}

  <Dialog.Root>
    <Dialog.Trigger class="w-full aspect-square cursor-pointer border-2 flex gap-2 items-center justify-center border-bg-1 hover:border-accent bg-bg-1">
      <p class="font-bold text-accent text-base">+ create board</p>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80" />
      <Dialog.Content class="bg-bg-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 w-sm translate-x-[-50%] translate-y-[-50%] p-4">
        <Dialog.Title
          class="flex w-full font-bold justify-center text-sm mb-8"
        >
          create a board
        </Dialog.Title>

        <div>
          <label for="name" class="block font-bold mb-1">name:</label>
          <input
            bind:value={boardName}
            id="name"
            class="w-full outline-none bg-border px-3 py-1.5"
            placeholder="new board"
            name="name"
            required
          />
        </div>

        <div class="flex justify-center w-full">
          <button onclick={createBoard} class="bg-fg text-bg px-3 py-1.5 mt-8 font-bold cursor-pointer outline-none hover:bg-fg-1">
            create
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</div>

