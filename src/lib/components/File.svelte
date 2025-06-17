<script lang="ts">
	import type { MessagesRecord } from '$lib/pocketbase-types';
	import { pb } from '$lib/pocketbase.svelte';

	let { record, class: classes }: { record: MessagesRecord; class?: string } = $props();
	const isImage = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
</script>

{#each record.files! as file}
	{#if isImage.test(file)}
		<img
			src={pb.files.getURL(record, file)}
			alt={file}
			class="my-2 max-h-50 w-auto rounded-md object-contain {classes}"
			loading="lazy"
		/>
	{:else}
		<div class="flex w-fit flex-row gap-2 rounded-md border px-1 {classes}">
			<p>{file}</p>
			<a href={pb.files.getURL(record, file)}>Download</a>
		</div>
	{/if}
{/each}
