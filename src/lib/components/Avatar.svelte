<script lang="ts">
	import type { UsersRecord } from '$lib/pocketbase-types';
	import { pb } from '$lib/pocketbase.svelte';

	let { record }: { record: UsersRecord } = $props();
</script>

{#if record.avatar}
	<img
		src={pb.files.getURL(record, record.avatar, { thumb: '48x48' })}
		alt="{record.name}'s Avatar"
		class="rounded-full"
	/>
{/if}
