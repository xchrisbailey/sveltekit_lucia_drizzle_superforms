import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { generateIdFromEntropySize } from 'lucia';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';

const schema = z.object({
	email: z.string().email().min(1).max(255),
	password: z.string().min(6).max(255)
});

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.id) {
		return redirect(302, '/');
	}

	const form = await superValidate(zod(schema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const user_id = generateIdFromEntropySize(10);
		const hashed_password = await new Argon2id().hash(form.data.password);

		await db.insert(users).values({
			id: user_id,
			email: form.data.email,
			password: hashed_password
		});

		const session = await lucia.createSession(user_id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		return redirect(302, '/');
	}
};
