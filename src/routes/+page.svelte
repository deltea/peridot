<script lang="ts">
  import "iconify-icon";
  import { getRelativeTime, slugify } from "$lib/utils.js";
  import type { Board } from "$lib/types";
  import { deleteEntry, setEntry } from "$lib/storage.js";
  import { Dialog, DropdownMenu } from "bits-ui";
  import { goto } from "$app/navigation";

  import Nav from "$components/Nav.svelte";
  import Button from "$components/Button.svelte";

  let { data } = $props();
  let boards: Board[] = $state(data.boards);
  let boardName: string = $state("");
  let createBoardOpen: boolean = $state(false);

  async function createBoard() {
    const newBoard: Board = {
      name: boardName,
      slug: slugify(boardName),
      updatedAt: new Date().toString(),
      createdAt: new Date().toString(),
      pieces: []
    }
    await setEntry(data.root, `boards/${newBoard.slug}.peridot`, newBoard);
    goto(`/board/${newBoard.slug}`);
  }

  async function deleteBoard(slug: string) {
    await deleteEntry(data.root, `boards/${slug}.peridot`);
    boards = boards.filter(board => board.slug !== slug);
  }
</script>

<Nav path="boards">
  <div class="flex gap-3">
    <Button onclick={() => createBoardOpen = !createBoardOpen}>
      + create board
    </Button>
    <Button variant="secondary" class="gap-2">
      <iconify-icon icon="mingcute:settings-3-fill" class="text-base"></iconify-icon>
      <span>settings</span>
    </Button>
  </div>
</Nav>

<div class="grid grid-cols-2 gap-4 w-xl h-fit">
  {#each boards as board}
    <div class="w-full aspect-square border-2 flex flex-col items-center justify-center border-border hover:border-accent relative group">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          class="absolute top-2 right-2 size-8 cursor-pointer hover:bg-muted justify-center items-center flex"
          onclick={(e: MouseEvent) => e.stopPropagation()}
        >
          <iconify-icon icon="mdi:dots-vertical" class="text-2xl"></iconify-icon>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            class="bg-muted outline-hidden p-2 w-50"
            sideOffset={8}
          >
            <DropdownMenu.Item
              class="px-3 py-1.5 cursor-pointer hover:bg-muted-1 outline-none flex items-center gap-2"
              onSelect={() => goto(`/board/${board.slug}`)}
            >
              <iconify-icon icon="mdi:pencil" class="text-base"></iconify-icon>
              <span>edit board</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              class="px-3 py-1.5 cursor-pointer hover:bg-muted-1 outline-none text-red-400 flex items-center gap-2"
              onSelect={() => deleteBoard(board.slug)}
            >
              <iconify-icon icon="mdi:delete" class="text-base"></iconify-icon>
              <span>delete board</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <a href={`/board/${board.slug}`} class="flex flex-col items-center justify-center size-full">
        <p class="font-bold text-accent text-xl">{board.name}</p>
        <span class="text-fg mt-2">{getRelativeTime(board.updatedAt)}</span>
      </a>
    </div>
  {/each}

  <Dialog.Root open={createBoardOpen}>
    <Dialog.Trigger class="w-full aspect-square cursor-pointer border-2 flex gap-2 items-center justify-center border-bg-1 hover:border-accent bg-bg-1 outline-none">
      <p class="font-bold text-accent text-base">
        + create board
      </p>
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80" />
      <Dialog.Content class="bg-bg-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 w-2xl translate-x-[-50%] translate-y-[-50%] flex flex-col items-stretch py-6 px-20">
        <Dialog.Title
          class="flex w-full font-bold justify-center text-sm mb-8"
        >
          create a board
        </Dialog.Title>

        <form onsubmit={createBoard}>
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
            <button type="submit" class="bg-fg text-bg px-3 py-1.5 mt-8 font-bold cursor-pointer outline-none hover:bg-fg-1">
              create
            </button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</div>
