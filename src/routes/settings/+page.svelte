<script lang="ts">
	import { onMount } from 'svelte';
	import { pb, currentUser, signOut } from '$lib/pocketbase.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import 'iconify-icon';

	let name: string = $state('');
	let file: FileList | undefined = $state();
	let oldPassword: string | undefined = $state();
	let password: string | undefined = $state();
	let confirmPassword: string | undefined = $state();

	onMount(async () => {
		name = currentUser.user.name;
	});

	async function saveChanges() {
		const nameChanged = name !== currentUser.user.name && name.length > 3;
		const fileChanged = file && file.length > 0;
		const passwordChanged =
			oldPassword &&
			password &&
			confirmPassword &&
			password.length > 0 &&
			password === confirmPassword;

		if (!nameChanged && !fileChanged && !passwordChanged) {
			alert('Please change at least one field (valid name, avatar, or matching password).');
			return;
		}
		if ((password || confirmPassword) && password !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}

		const data = {
			name: name,
			avatar: file ? Array.from(file) : undefined,
			oldPassword: oldPassword,
			password: password,
			passwordConfirm: confirmPassword
		};
		await pb.collection('users').update(currentUser.user.id, data);
		if (passwordChanged) {
			signOut();
			window.location.href = '/';
		} else {
			await pb.collection('users').authRefresh();
		}
		alert('Successful');
		return;
	}
</script>

<a href="/" aria-label="back"><iconify-icon icon="ep:back" class="link text-2xl"></iconify-icon></a>

<form class="flex w-1/6 flex-col gap-4" onsubmit={saveChanges}>
	<div class="flex flex-col">
		<label for="name">Name</label>
		<input id="name" type="text" placeholder="Name" class="border-b" bind:value={name} />
	</div>

	<div>
		<label for="avatar">Avatar</label>
		<input id="avatar" type="file" bind:files={file} />
		<Avatar record={currentUser.user} class="h-auto w-10" />
	</div>

	<div>
		<label for="password">Change Password</label>
		<div class="flex flex-row gap-2">
			<input type="password" placeholder="Old Password" class="border-b" bind:value={oldPassword} />
			<input
				id="password"
				type="password"
				placeholder="Password"
				class="border-b"
				bind:value={password}
			/>
			<input
				type="password"
				placeholder="Confirm Password"
				class="border-b"
				bind:value={confirmPassword}
			/>
		</div>
	</div>
	<button type="submit" class="btn">Save changes</button>
</form>
