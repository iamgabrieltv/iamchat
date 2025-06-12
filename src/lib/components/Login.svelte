<script lang="ts">
	import { pb } from '$lib/pocketbase.svelte';

	let password = $state('');
	let email = $state('');

	async function login() {
		await pb.collection('users').authWithPassword(email, password);
	}
</script>

<form>
	<input placeholder="E-Mail" type="email" bind:value={email} />
	<input placeholder="Password" type="password" bind:value={password} />
	<button type="submit" class="btn" onclick={login}>Login</button>
</form>
