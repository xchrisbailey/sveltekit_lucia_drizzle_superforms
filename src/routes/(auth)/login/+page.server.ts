import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	email: z.string().email().min(1).max(255),
	password: z.string().min(6).max(255)
});

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.id) {
		return redirect(302, '/');
	}

	const form = await superValidate(zod(schema));
	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const user = await db.query.users.findFirst({
			where: eq(users.email, form.data.email)
		});
		if (!user) {
			return fail(401, { form: { errors: { email: 'Email not found' } } });
		}

		const valid_password = await new Argon2id().verify(user.password, form.data.password);
		if (!valid_password) {
			return fail(401, { form: { errors: { password: 'Invalid password' } } });
		}

		const session = await lucia.createSession(user.id, {});
		const session_cookie = lucia.createSessionCookie(session.id);
		cookies.set(session_cookie.name, session_cookie.value, {
			path: '.',
			...session_cookie.attributes
		});

		return redirect(302, '/');
	}
};
