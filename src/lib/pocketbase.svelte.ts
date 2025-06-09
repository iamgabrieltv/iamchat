import type { TypedPocketBase, UsersRecord } from '$lib/pocketbase-types';
import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090') as TypedPocketBase;

export let currentUser = $state({
	user: pb.authStore.record as unknown as UsersRecord
});

pb.authStore.onChange(() => {
	currentUser.user = pb.authStore.record as unknown as UsersRecord;
});

export function signOut() {
	pb.authStore.clear();
}
