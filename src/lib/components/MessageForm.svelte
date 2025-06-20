<script lang="ts">
	import type { ConversationsResponse } from '$lib/pocketbase-types';
	import { currentUser, pb } from '$lib/pocketbase.svelte';
	import imageCompression from 'browser-image-compression';

	let { conversation }: { conversation: ConversationsResponse } = $props();
	let message = $state('');
	let files: FileList | undefined = $state();
	let form: HTMLFormElement | undefined = $state();
	let input: HTMLInputElement | undefined = $state();

	async function filesHandler() {
		if (!files || files.length === 0) return;
		let fileArray = Array.from(files);
		let compressedFiles = await Promise.all(
			fileArray.map(async (file) => {
				if (
					file.type.startsWith('image/') &&
					file.type !== 'image/gif' &&
					message !== '/lossless'
				) {
					const options = {
						maxSizeMB: 2,
						useWebWorker: true,
						fileType: 'image/webp'
					};
					try {
						return await imageCompression(file, options);
					} catch (error) {
						console.error('Error compressing image:', error);
						return file;
					}
				} else {
					return file;
				}
			})
		);
		return compressedFiles;
	}

	async function sendMessage() {
		if (message.trim().length > 0) {
			let data = {
				user: currentUser.user.id,
				conversation: conversation.id,
				text: message,
				files: files ? await filesHandler() : undefined
			};
			await pb.collection('messages').create(data);
			form!.reset();
			input!.focus();
		}
	}
</script>

<form bind:this={form} onsubmit={sendMessage} class="flex flex-row items-center gap-1">
	<input
		type="text"
		placeholder="Say something..."
		class="border-b focus:outline-0"
		bind:value={message}
		bind:this={input}
	/>
	<input type="file" multiple bind:files />
	<button tabindex="-1" type="submit" class="btn">Send</button>
</form>
