<script lang="ts">
	import type { UsersRecord } from '$lib/pocketbase-types';
	import { pb } from '$lib/pocketbase.svelte';

	let { record, class: classes }: { record: UsersRecord; class?: string } = $props();
</script>

{#if record.avatar}
	<img
		src={pb.files.getURL(record, record.avatar, { thumb: '48x48' })}
		alt="{record.name}'s Avatar"
		class="rounded-full {classes}"
	/>
{/if}
