<script lang="ts">
	import type { MessagesRecord } from '$lib/pocketbase-types';
	import { pb } from '$lib/pocketbase.svelte';

	let { record }: { record: MessagesRecord } = $props();
	const isImage = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
</script>

{#each record.files! as file}
	{#if isImage.test(file)}
		<img
			src={pb.files.getURL(record, file)}
			alt={file}
			class="my-2 h-auto max-w-44 rounded-md object-contain"
			loading="lazy"
		/>
	{:else}
		<div class="flex w-fit flex-row gap-2 rounded-md border px-1">
			<p>{file}</p>
			<a href={pb.files.getURL(record, file)}>Download</a>
		</div>
	{/if}
{/each}
