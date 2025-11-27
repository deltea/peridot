<script lang="ts">
  import { page } from "$app/state";
  import { getEntry } from "$lib/storage.js";
  import type { Board } from "$lib/types.js";
  import { onMount } from "svelte";

  let { data } = $props();
  let board: Board;

  onMount(async () => {
    board = await getEntry<Board>(data.root, `boards/${page.params.slug}.peridot`);
    console.log(board);
  });
</script>


