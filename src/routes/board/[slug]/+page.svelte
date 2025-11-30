<script lang="ts">
  import { page } from "$app/state";
  import { getEntry, setEntry } from "$lib/storage.js";
  import type { Board, NotePiece } from "$lib/types.js";
  import { onMount, tick } from "svelte";
  import hotkeys from "hotkeys-js";

  let { data } = $props();
  let board: Board = $state({} as Board);
  let isAddingPiece = $state(false);
  let newPieceContent = $state("");
  let newPieceInput: HTMLTextAreaElement | null = $state(null);

  function addPiece() {
    if (newPieceContent.length === 0) return;
    board.pieces = [
      ...board.pieces,
      {
        type: "note",
        content: newPieceContent,
      } as NotePiece,
    ];
    setEntry(data.root, `boards/${page.params.slug}.peridot`, board);
    newPieceContent = "";
    isAddingPiece = false;
  }

  onMount(async () => {
    board = await getEntry<Board>(data.root, `boards/${page.params.slug}.peridot`);
    hotkeys.filter = () => true;
    hotkeys("ctrl+n", (e) => {
      e.preventDefault();
      isAddingPiece = true;
      tick().then(() => newPieceInput?.focus());
    });
    hotkeys("cmd+enter", (e) => {
      if (isAddingPiece) {
        e.preventDefault();
        addPiece();
      }
    });
    hotkeys("esc", (e) => {
      e.preventDefault();
      isAddingPiece = false;
    })
  });
</script>

<div class="w-xl h-fit space-y-2">
  {#if board.pieces && board.pieces.length > 0 || isAddingPiece}
    {#if isAddingPiece}
      <div class="bg-bg-1 flex flex-col w-1/2 gap2">
        <textarea
          bind:value={newPieceContent}
          bind:this={newPieceInput}
          placeholder="start typing here..."
          class="w-full p-4 outline-none resize-none"
        ></textarea>

        <div class="flex justify-between px-2 pb-2">
          <div class="flex gap-2">
            <!-- <button aria-label="button" class="cursor-pointer size-6 bg-muted-1 text-fg font-black text-base flex justify-center items-center">
              <iconify-icon icon="material-symbols:upload" class="text-lg"></iconify-icon>
            </button> -->
          </div>

          <button
            onclick={addPiece}
            class="cursor-pointer size-6 bg-fg text-bg font-black text-base"
          >+</button>
        </div>
      </div>
    {/if}

    {#if board.pieces.length > 0}
      <div class="flex gap-2 flex-wrap">
        {#each new Array(2) as _, col}
          <div class="flex-1 flex flex-col items-center gap-2">
            {#each board.pieces.slice().reverse() as piece, i}
              {#if (col === 0 && i % 2 === 0) || (col === 1 && i % 2 !== 0)}
                {#if piece.type === "note"}
                  <div class="bg-bg-1 flex flex-col w-full p-4 wrap-anywhere">
                    {piece.content}
                  </div>
                {/if}
              {/if}
            {/each}
          </div>
        {/each}
      </div>
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
