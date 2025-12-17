<script lang="ts">
  import type { Piece } from "$lib/types.js";
  import { cn } from "$lib/utils";
  import SvelteMarkdown from "svelte-markdown";

  let { piece, selected, refreshLayout, selectPiece }: {
    piece: Piece;
    selected: boolean;
    refreshLayout: () => void;
    selectPiece: (piece: Piece) => void;
  } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  ondragstart={e => e.preventDefault()}
  onmousedown={() => selectPiece(piece)}
  id="piece"
  class={cn(
    "w-full relative",
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
    <img src={piece.url} alt={piece.caption} onload={refreshLayout} class="w-full object-contain" />
  {/if}
</div>
