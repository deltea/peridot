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
	<title>
		peridot
		{path.length > 0 ? ` - ${path[path.length - 1]}` : ""}
	</title>
</svelte:head>

<main class="min-h-screen flex flex-col">
	<div class="mb-nav flex justify-center grow py-16">
		{@render children()}
	</div>
</main>
