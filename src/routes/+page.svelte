<script lang="ts">
  import "iconify-icon";
  import { getRelativeTime } from "$lib/utils.js";

  let { data } = $props();
</script>

<div class="grid grid-cols-2 gap-4 w-xl h-fit">
  {#each data.boards as board}
    <a
      href={`/board/${board.slug}`}
      class="w-full aspect-square border-2 flex flex-col items-center justify-center border-muted hover:border-accent"
    >
      <header class="font-bold text-accent text-lg">{board.name}</header>
      <span class="text-sm text-fg mt-2">{getRelativeTime(board.dateUpdated)}</span>
    </a>
  {/each}

  <button
    class="w-full aspect-square border-2 flex gap-4 flex-col items-center justify-center border-muted hover:border-accent"
  >
    <!-- <iconify-icon icon="mdi:plus" class="text-5xl"></iconify-icon> -->
    <header class="font-bold text-accent text-lg">+ CREATE BOARD</header>
    <!-- <span class="text-sm text-fg mt-2">{board.dateCreated}</span> -->
  </button>
</div>
