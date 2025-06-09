<script lang="ts">
	import Conversations from '$lib/components/Conversations.svelte';
	import MessageForm from '$lib/components/MessageForm.svelte';
	import Messages from '$lib/components/Messages.svelte';
	import type { ConversationsResponse } from '$lib/pocketbase-types';

	let selectedConversation: ConversationsResponse | null | undefined = $state();
</script>

<div class="flex h-full w-full flex-row border">
	<Conversations bind:selectedConversation />
	<div class="w-11/12">
		{#if selectedConversation}
			<div class="w-full border-b">
				<p class="py-1 pl-2">{selectedConversation.name}</p>
			</div>
			{#key selectedConversation}
				<div class="h-full pl-2">
					<Messages conversation={selectedConversation} />
					<MessageForm conversation={selectedConversation} />
				</div>
			{/key}
		{/if}
	</div>
</div>
