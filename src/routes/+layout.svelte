<script lang="ts">
	import { page } from "$app/state";
	import "./layout.css";
	import "iconify-icon";

	let { children } = $props();
	const path = page.url.pathname.split("/").filter(Boolean);
</script>

<svelte:head>
	<title>Peridot</title>
</svelte:head>

<main class="min-h-screen flex flex-col">
	<!-- navbar -->
	<div class="flex items-center px-4 h-nav gap-3 bg-bg w-full fixed top-0 left-0">
		<a href="/" class="flex items-center gap-1">
			<!-- <img src="/logo.svg" alt="Logo" class="size-3.5" /> -->
			<header class="font-bold">PERIDOT</header>
		</a>

		{#each path as p, i}
			<span>/</span>
			{#if i === path.length - 1}
				<span class="text-accent">{p}</span>
			{:else}
				<span class="text-fg">{p}</span>
			{/if}
		{/each}
	</div>

	<div class="mt-nav flex justify-center grow pt-4">
		{@render children()}
	</div>
</main>
