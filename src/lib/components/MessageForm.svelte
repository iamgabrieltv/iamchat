<script lang="ts">
	import type { ConversationsResponse } from '$lib/pocketbase-types';
	import { currentUser, pb } from '$lib/pocketbase.svelte';

	let { conversation }: { conversation: ConversationsResponse } = $props();
	let message = $state('');
	let files: FileList | undefined = $state();
	let form: HTMLFormElement | undefined = $state();

	async function sendMessage() {
		if (message.trim().length > 0) {
			let data = {
				user: currentUser.user.id,
				conversation: conversation.id,
				text: message,
				files: files ? Array.from(files) : undefined
			};
			await pb.collection('messages').create(data);
			form!.reset();
		}
	}
</script>

<form bind:this={form} onsubmit={sendMessage}>
	<input type="text" placeholder="Say something..." bind:value={message} />
	<input type="file" multiple bind:files />
	<button type="submit" class="btn">Send</button>
</form>
