import { lucia } from '$lib/server/auth';
import { type Actions, redirect } from '@sveltejs/kit';
import { fail } from 'sveltekit-superforms';

export const actions: Actions = {
	default: async ({ cookies, locals }) => {
		if (!locals.session) {
			return fail(401);
		}

		await lucia.invalidateSession(locals.session.id);
		const session_cookie = lucia.createBlankSessionCookie();
		cookies.set(session_cookie.name, session_cookie.value, {
			path: '.',
			...session_cookie.attributes
		});

		return redirect(302, '/login');
	}
};
