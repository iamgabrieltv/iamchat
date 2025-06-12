<script lang="ts">
	import Conversations from '$lib/components/Conversations.svelte';
	import MessageForm from '$lib/components/MessageForm.svelte';
	import Messages from '$lib/components/Messages.svelte';
	import Members from '$lib/components/Members.svelte';
	import type { ConversationsResponse } from '$lib/pocketbase-types';
	import { signOut } from '$lib/pocketbase.svelte';
	import 'iconify-icon';

	let selectedConversation: ConversationsResponse | null | undefined = $state();
</script>

<div class="flex h-full w-full flex-row border">
	<aside class="flex max-w-xs min-w-fit flex-col overflow-y-auto border-r">
		<Conversations bind:selectedConversation />
		<div class="flex flex-1 flex-col justify-end">
			<div class="flex flex-row items-center gap-2">
				<button class="btn" onclick={signOut}>Sign Out</button>
				<a href="/settings" aria-label="Settings" class="link flex items-center text-2xl"
					><iconify-icon icon="ri:settings-line"></iconify-icon></a
				>
			</div>
		</div>
	</aside>
	{#if selectedConversation}
		{#key selectedConversation}
			<section class="flex w-full flex-col">
				<header class="h-fit w-full border-b px-2 py-1">
					<p>{selectedConversation.name}</p>
				</header>
				<div class="overflow-auto px-2">
					<Messages conversation={selectedConversation} />
				</div>
				<div class="px-2">
					<MessageForm conversation={selectedConversation} />
				</div>
			</section>
			<aside class="max-w-xs min-w-[100px] justify-self-end overflow-y-auto border-l px-2">
				<Members conversation={selectedConversation} />
			</aside>
		{/key}
	{/if}
</div>
