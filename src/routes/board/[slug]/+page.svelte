<script lang="ts">
  import { page } from "$app/state";
  import { getEntry } from "$lib/storage.js";
  import type { Board, NotePiece } from "$lib/types.js";
  import { onMount, tick } from "svelte";
  import hotkeys from "hotkeys-js";

  let { data } = $props();
  let board: Board = $state({} as Board);
  let isAddingPiece = $state(false);
  let newPieceContent = $state("");
  let newPieceInput: HTMLInputElement | null = $state(null);

  function addPiece() {
    if (newPieceContent.length === 0) return;
    board.pieces = [
      ...board.pieces,
      {
        type: "note",
        content: newPieceContent,
      } as NotePiece,
    ];
    newPieceContent = "";
    isAddingPiece = false;
  }

  onMount(async () => {
    board = await getEntry<Board>(data.root, `boards/${page.params.slug}.peridot`);
    hotkeys("ctrl+n", (event) => {
      event.preventDefault();
      isAddingPiece = true;
      tick().then(() => {
        newPieceInput?.focus();
      });
    });
  });
</script>

<div class="w-xl h-fit space-y-2">
  {#if board.pieces && board.pieces.length > 0 || isAddingPiece}
    {#if board.pieces.length > 0}
      <div class="space-y-2">
        {#each board.pieces as piece}
          {#if piece.type === "note"}
            <div class="bg-bg-1 flex flex-col w-1/2 p-4">
              {piece.content}
            </div>
          {/if}
        {/each}
      </div>
    {/if}
    {#if isAddingPiece}
      <form onsubmit={addPiece} class="bg-bg-1 flex flex-col w-1/2 gap2">
        <input
          bind:value={newPieceContent}
          bind:this={newPieceInput}
          type="text"
          placeholder="start typing here..."
          class="w-full p-4 outline-none"
        />

        <div class="flex justify-between px-2 pb-2">
          <div class="flex gap-2">
            <!-- <button aria-label="button" class="cursor-pointer size-6 bg-muted-1 text-fg font-black text-base flex justify-center items-center">
              <iconify-icon icon="material-symbols:upload" class="text-lg"></iconify-icon>
            </button> -->
          </div>

          <button class="cursor-pointer size-6 bg-fg text-bg font-black text-base">+</button>
        </div>
      </form>
    {/if}
  {:else}
    <div class="flex gap-8 h-full relative">
      <div class="grow flex flex-col gap-8 items-center h-full">
        <div class="w-full h-40 bg-bg-1"></div>
        <div class="w-full h-20 bg-bg-1"></div>
        <div class="w-full h-80 bg-bg-1"></div>
      </div>
      <div class="grow flex flex-col gap-8 items-center">
        <div class="w-full h-80 bg-bg-1"></div>
        <div class="w-full h-40 bg-bg-1"></div>
        <div class="w-full h-20 bg-bg-1"></div>
      </div>

      <div class="absolute top-24 text-center w-full">
        press <span class="bg-muted py-1 px-1.5">ctrl+n</span> to add a new piece
      </div>
      <div class="h-2/3 absolute bottom-0 left-0 bg-linear-to-t from-bg to-transparent w-full"></div>
    </div>
  {/if}
</div>
