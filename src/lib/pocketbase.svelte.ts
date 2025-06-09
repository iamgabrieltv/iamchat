import type { TypedPocketBase, UsersRecord } from '$lib/pocketbase-types';
import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL) as TypedPocketBase;

export let currentUser = $state({
	user: pb.authStore.record as unknown as UsersRecord
});

pb.authStore.onChange(() => {
	currentUser.user = pb.authStore.record as unknown as UsersRecord;
});

export function signOut() {
	pb.authStore.clear();
}
