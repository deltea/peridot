<script lang="ts">
  import type { Piece } from "$lib/types.js";
  import { cn } from "$lib/utils";
  import { onMount } from "svelte";
  import SvelteMarkdown from "svelte-markdown";
  import { fade, scale } from "svelte/transition";

  let { piece, selected, isZoomed, refreshLayout, selectPiece }: {
    piece: Piece;
    selected: boolean;
    isZoomed: boolean;
    refreshLayout: () => void;
    selectPiece: (piece: Piece) => void;
  } = $props();
</script>

<div
  role="button"
  tabindex="0"
  ondragstart={e => e.preventDefault()}
  onmousedown={() => selectPiece(piece)}
  id="piece"
  class={cn(
    "w-full relative outline-none",
    { "ring-2 ring-fg": selected }
  )}
>
  {#if piece.type === "note"}
    <p class="bg-bg-1 flex flex-col w-full p-4 wrap-anywhere whitespace-pre-wrap">
      <SvelteMarkdown source={piece.content} />
    </p>
  {:else if piece.type === "link"}
    <div class="bg-bg-1 flex flex-col w-full p-4">
      <a href={piece.url} target="_blank" class="underline wrap-anywhere whitespace-pre-wrap">
        {piece.url}
      </a>
    </div>
  {:else if piece.type === "image"}
    <img
      src={piece.url}
      alt={piece.caption}
      onload={refreshLayout}
      class="w-full object-contain"
      loading="lazy"
    />
  {/if}
</div>

{#if isZoomed && piece.type === "image"}
  <div
    transition:fade={{ duration: 120 }}
    class="w-screen h-screen fixed top-0 left-0 bg-black/60 flex justify-center items-center z-50 p-16"
  >
    <img
      transition:scale={{ duration: 120 }}
      src={piece.url}
      alt={piece.caption}
      class="h-full w-full object-contain"
    />
  </div>
{/if}
