<script lang="ts">
	import type { ConversationsResponse } from '$lib/pocketbase-types';
	import { pb } from '$lib/pocketbase.svelte';
	import { onMount } from 'svelte';

	let { conversation }: { conversation: ConversationsResponse } = $props();
	type ExpandedConversationsResponse = ConversationsResponse<{ users: { name: string }[] }>;
	let members: string[] = $state([]);

	onMount(async () => {
		const result = (await pb.collection('conversations').getOne(conversation.id, {
			fields: 'expand',
			expand: 'users'
		})) as ExpandedConversationsResponse;
		members = result.expand.users.map((user) => user.name);
	});
</script>

<div>
	{#each members as user}
		<p>{user}</p>
	{/each}
</div>
