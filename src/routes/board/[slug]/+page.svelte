<script lang="ts">
  import { page } from "$app/state";
  import { getEntry } from "$lib/storage.js";
  import type { Board } from "$lib/types.js";
  import { onMount } from "svelte";

  let { data } = $props();
  let board: Board = $state({} as Board);

  onMount(async () => {
    board = await getEntry<Board>(data.root, `boards/${page.params.slug}.peridot`);
    console.log(board);
  });
</script>

<div class="w-xl h-fit">
  {#if board.pieces && board.pieces.length > 0}
    <p>stuff</p>
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
