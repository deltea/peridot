<script lang="ts">
  import type { Piece } from "$lib/types.js";

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
  onclick={() => selectPiece(piece)}
  id="piece"
  class="w-full relative {selected ? "ring-2" : ""}"
>
  {#if piece.type === "note"}
    <p class="bg-bg-1 flex flex-col w-full p-4 wrap-anywhere whitespace-pre-wrap">
      {piece.content}
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
