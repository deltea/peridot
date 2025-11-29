<script lang="ts">
	import { page } from "$app/state";
	import "./layout.css";
	import "iconify-icon";

	let { children } = $props();
	let path: string[] = $state([]);

	$effect(() => {
		path = page.url.pathname.split("/").filter(Boolean);
	});
</script>

<svelte:head>
	<title>Peridot</title>
</svelte:head>

<main class="min-h-screen flex flex-col">
	<!-- navbar -->
	<div class="flex justify-between items-center text-xs px-4 h-nav bg-bg w-full fixed top-0 left-0">
		<div class="flex gap-3 items-center">
			<a href="/" class="flex items-center gap-1">
				<!-- <img src="/logo.svg" alt="Logo" class="size-3.5" /> -->
				<header class="font-bold text-sm flex items-center gap-1">
					<img src="/logo.svg" alt="Logo" class="size-3.5" />
					<span class="sm:block hidden">PERIDOT</span>
				</header>
			</a>

			{#each path as p, i}
				<span>{">"}</span>
				{#if i === path.length - 1}
					<span class="text-accent">{p}</span>
			{:else}
					<span class="text-fg">{p}</span>
				{/if}
			{/each}
		</div>

		<div class="flex gap-3">
			<button class="bg-fg text-bg px-2 py-1 font-bold cursor-pointer outline-none hover:bg-fg-1">
				+ add piece
			</button>
			<button class="bg-muted text-fg px-2 py-1 flex items-center gap-1 font-bold cursor-pointer outline-none hover:bg-muted-1">
				<!-- <iconify-icon icon="mdi:pencil" class="text-sm"></iconify-icon> -->
				<span>edit board</span>
			</button>
		</div>
	</div>

	<div class="mt-nav flex justify-center grow pt-4">
		{@render children()}
	</div>
</main>
