<script lang="ts">
	import type { ConversationsResponse } from '$lib/pocketbase-types';
	import { pb, currentUser } from '$lib/pocketbase.svelte';

	const conversations = pb
		.collection('conversations')
		.getFullList({ filter: `users.id ?= "${currentUser.user.id}"` });

	let {
		selectedConversation = $bindable()
	}: { selectedConversation: ConversationsResponse | null | undefined } = $props();
</script>

{#await conversations}
	<p>Loading...</p>
{:then conversations}
	<div class="flex h-full w-1/12 flex-col place-items-start border-r">
		{#each conversations as conversation}
			<button
				class="btn"
				onclick={() => {
					if ($state.snapshot(selectedConversation)?.id !== conversation.id) {
						selectedConversation = conversation;
					}
				}}>{conversation.name}</button
			>
		{/each}
	</div>
{/await}
