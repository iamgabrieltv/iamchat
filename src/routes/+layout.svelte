<script lang="ts">
	import '../app.css';
	import { currentUser, pb } from '$lib/pocketbase.svelte';
	import Login from '$lib/components/Login.svelte';

	let { children } = $props();
</script>

<main class="h-screen w-screen overflow-hidden p-4">
	{#if currentUser.user && pb.authStore.isValid}
		{@render children()}
	{:else}
		<Login />
	{/if}
</main>
