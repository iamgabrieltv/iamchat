import { CF_PAGES_COMMIT_SHA } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		commitSha: CF_PAGES_COMMIT_SHA
	};
};
