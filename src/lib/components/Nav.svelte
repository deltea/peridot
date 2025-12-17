<script lang="ts">
  import type { Snippet } from "svelte";

  let { path, children }: {
    path: string;
    children?: Snippet<[]>;
  } = $props();
</script>

<div class="flex justify-between items-center h-nav w-full fixed bottom-0 left-0 z-50">
  <div class="flex gap-3 items-center bg-bg h-full px-4">
    <a href="/" class="flex items-center gap-1">
      <header class="font-bold text-sm flex items-center gap-1">
        <img src="/logo.svg" alt="Logo" class="size-3.5" />
        <span class="sm:block hidden">peridot</span>
      </header>
    </a>

    {#each path.split("/") as p, i}
      <span>{">"}</span>
      {#if i === path.length - 1}
        <span class="text-accent">{p}</span>
    {:else}
        <span class="text-fg">{p}</span>
      {/if}
    {/each}
  </div>

  {#if children}
    <div class="h-full px-4 bg-bg flex items-center">
      {@render children()}
    </div>
  {/if}
</div>
