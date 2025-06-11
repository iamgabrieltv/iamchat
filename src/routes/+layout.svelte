<script lang="ts">
	import '../app.css';
	import { currentUser } from '$lib/pocketbase.svelte';
	import Login from '$lib/components/Login.svelte';

	let { children } = $props();
</script>

<main class="h-screen overflow-hidden p-4">
	{#if currentUser.user}
		{@render children()}
	{:else}
		<Login />
	{/if}
</main>
