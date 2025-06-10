<script lang="ts">
	import type { ConversationsResponse, MessagesResponse } from '$lib/pocketbase-types';
	import { pb } from '$lib/pocketbase.svelte';
	import { onMount, onDestroy } from 'svelte';
	import File from './File.svelte';

	type ExpandedMessagesResponse = MessagesResponse<{ user: { name: string } }>[];

	let messages: ExpandedMessagesResponse = $state([]);
	let loading = $state(true);
	let messageContainer: HTMLDivElement | undefined = $state();
	$effect(() => {
		messageContainer?.scrollTo({
			top: messageContainer.scrollHeight,
			behavior: 'instant'
		});
	});

	let { conversation }: { conversation: ConversationsResponse } = $props();

	onMount(async () => {
		messages = await pb.collection('messages').getFullList({
			sort: '+created',
			expand: 'user',
			filter: `conversation.id = "${conversation.id}"`
		});
		loading = false;

		pb.collection('messages').subscribe(
			'*',
			async (e) => {
				if (e.action === 'create') {
					messages.push(e.record as ExpandedMessagesResponse[0]);
				}
				if (e.action === 'delete') {
					messages = messages.filter((msg) => msg.id !== e.record.id);
				}
			},
			{
				expand: 'user',
				filter: `conversation.id = "${conversation.id}"`
			}
		);
	});

	onDestroy(() => {
		pb.collection('messages').unsubscribe();
	});
</script>

{#if loading}
	<p>Loading...</p>
{:else}
	<div class="max-h-11/12 overflow-auto" bind:this={messageContainer}>
		{#each messages as message}
			<p>{message.expand.user.name}: {message.text}</p>
			{#if message.files.length > 0}
				<File record={message} />
			{/if}
		{/each}
	</div>
{/if}
