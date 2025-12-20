<script lang="ts">
  import type { Snippet } from "svelte";

  let { title, children }: {
    title?: string;
    children?: Snippet<[]>;
  } = $props();
</script>

<div class="flex justify-between items-center bg-bg h-nav w-full fixed top-0 left-0 z-50">
  <a href="/" class="flex items-center gap-1 h-full px-4">
    <header class="font-bold text-sm flex items-center gap-1">
      <img src="/logo.svg" alt="Logo" class="size-3.5" />
      <span class="sm:block hidden">peridot</span>
    </header>
  </a>

  <h2 class="fixed top-0 h-nav flex items-center left-1/2 -translate-x-1/2">
    {title}
  </h2>

  {#if children}
    <div class="h-full px-4 bg-bg flex items-center">
      {@render children()}
    </div>
  {/if}
</div>
