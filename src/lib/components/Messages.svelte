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
	import 'iconify-icon';

	type ExpandedMessagesResponse = MessagesResponse<{ user: UsersResponse }>[];

	let messages: ExpandedMessagesResponse = $state([]);
	let loading = $state(true);
	const isMobile = navigator.maxTouchPoints > 2;

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

	async function deleteMessage(id: string) {
		await pb.collection('messages').delete(id);
	}

	onMount(async () => {
		fetchMessages();
		subscribe();

		if (isMobile) {
			document.addEventListener('visibilitychange', function () {
				if (document.visibilityState === 'hidden') {
					pb.collection('messages').unsubscribe();
					console.log('unsubscribed');
				} else if (document.visibilityState === 'visible') {
					fetchMessages();
					subscribe();
					console.log('resubscribed');
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
			<div
				tabindex="-1"
				class="group flex flex-row items-center gap-1 p-1 hover:bg-[#111111] {isMobile
					? 'focus:bg-[#111111]'
					: ''}"
			>
				<Avatar record={message.expand.user} class="h-8 w-8" />
				<p>{message.expand.user.name}: {message.text}</p>
				<div
					class="flex scale-0 flex-row items-center gap-1 group-hover:scale-100 {isMobile
						? 'group-focus:scale-100'
						: ''}"
				>
					<p class="label">{new Date(message.created).toLocaleString()}</p>
					<button aria-label="delete" class="link" onclick={() => deleteMessage(message.id)}
						><iconify-icon Icon="material-symbols:delete"></iconify-icon></button
					>
				</div>
			</div>
		{/each}
	</div>
{/if}
