<script lang="ts">
	import type {
		ConversationsResponse,
		MessagesResponse,
		UsersResponse
	} from '$lib/pocketbase-types';
	import { pb } from '$lib/pocketbase.svelte';
	import { onMount, onDestroy } from 'svelte';
	import File from './File.svelte';
	import Avatar from './Avatar.svelte';

	type ExpandedMessagesResponse = MessagesResponse<{ user: UsersResponse }>[];

	let messages: ExpandedMessagesResponse = $state([]);
	let loading = $state(true);

	let { conversation }: { conversation: ConversationsResponse } = $props();

	function subscribe() {
		pb.collection('messages').subscribe(
			'*',
			async (e) => {
				if (e.action === 'create') {
					messages = [e.record as ExpandedMessagesResponse[0], ...messages];
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
	}

	async function fetchMessages() {
		const result = await pb.collection('messages').getList(1, 100, {
			sort: '-created',
			expand: 'user',
			filter: `conversation.id = "${conversation.id}"`
		});
		messages = result.items as ExpandedMessagesResponse;
		loading = false;
	}

	onMount(async () => {
		fetchMessages();
		subscribe();

		if (/iPad|iPhone|Android/.test(navigator.userAgent)) {
			document.addEventListener('visibilitychange', function () {
				if (document.visibilityState === 'hidden') {
					pb.collection('messages').unsubscribe();
				} else if (document.visibilityState === 'visible') {
					fetchMessages();
					subscribe();
				}
			});
		}
	});

	onDestroy(() => {
		pb.collection('messages').unsubscribe();
	});
</script>

{#if loading}
	<p>Loading...</p>
{:else}
	<div class="flex h-full flex-col-reverse overflow-auto">
		{#each messages as message}
			{#if message.files.length > 0}
				<File record={message} />
			{/if}
			<div class="group flex flex-row items-center gap-1 p-1">
				<Avatar record={message.expand.user} class="h-8 w-8" />
				<p>{message.expand.user.name}: {message.text}</p>
				<p class="label scale-0 group-hover:scale-100">
					{new Date(message.created).toLocaleString()}
				</p>
			</div>
		{/each}
	</div>
{/if}
