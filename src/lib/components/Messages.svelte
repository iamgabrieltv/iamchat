<script lang="ts">
	import type {
		ConversationsResponse,
		MessagesResponse,
		UsersResponse
	} from '$lib/pocketbase-types';
	import { currentUser, pb } from '$lib/pocketbase.svelte';
	import { onMount, onDestroy } from 'svelte';
	import File from './File.svelte';
	import Avatar from './Avatar.svelte';
	import 'iconify-icon';

	type ExpandedMessagesResponse = MessagesResponse<{ user: UsersResponse }>[];

	let messages: ExpandedMessagesResponse = $state([]);
	let loading = $state(true);
	let index = 1;
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

	async function addMessages() {
		if (index === -1) return;
		const result = await pb.collection('messages').getList(index, 100, {
			sort: '-created',
			expand: 'user',
			filter: `conversation.id = "${conversation.id}"`
		});
		if (result.items.length > 0) {
			messages = [...messages, ...(result.items as ExpandedMessagesResponse)];
		} else {
			index = -1;
		}
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

	let messageContainer: HTMLDivElement | undefined = $state();
	function handleScroll() {
		if (
			Math.abs(messageContainer!.scrollTop) + messageContainer!.clientHeight ===
			messageContainer!.scrollHeight
		) {
			index++;
			addMessages();
		}
	}
</script>

{#if loading}
	<p>Loading...</p>
{:else}
	<div
		class="flex h-full flex-col-reverse items-start overflow-auto"
		bind:this={messageContainer}
		onscroll={handleScroll}
	>
		{#each messages as message, i}
			{#if message.files.length > 0}
				<File record={message} class="ml-9" />
			{/if}
			<div
				tabindex="-1"
				class="group flex w-full flex-row items-center gap-0 px-1 hover:bg-[#111111] {isMobile
					? 'focus:bg-[#111111]'
					: ''}"
			>
				{#if messages[i + 1]?.expand.user.id !== message.expand.user.id || new Date(messages[i + 1]?.created).getTime() + 10 * 60000 < new Date(message.created).getTime()}
					<Avatar record={message.expand.user} class="mr-1 h-8 w-8" />
					<div class="flex flex-col items-start">
						<p class="font-bold">
							{message.expand.user.name}
							<span class="label font-normal"
								>{new Date(message.created).toLocaleTimeString([], {
									hour: '2-digit',
									minute: '2-digit'
								})}</span
							>
						</p>
						<p>{message.text}</p>
					</div>
				{:else}
					<p class="pl-9">{message.text}</p>
				{/if}
				<div
					class="flex scale-0 flex-row items-center gap-1 group-hover:scale-100 {isMobile
						? 'group-focus:scale-100'
						: ''}"
				>
					<p class="label">{new Date(message.created).toLocaleString()}</p>
					{#if message.expand.user.id === currentUser.user.id}
						<button aria-label="delete" class="link" onclick={() => deleteMessage(message.id)}
							><iconify-icon Icon="material-symbols:delete"></iconify-icon></button
						>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}
