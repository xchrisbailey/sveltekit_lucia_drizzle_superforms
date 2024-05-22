<script lang="ts">
	import { goto } from '$app/navigation';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';

	export let data: PageData;

	const { form, constraints, enhance } = superForm(data.form, {
		async onUpdated({ form }) {
			if (form.valid) {
				toast.success('Logged In!');
				await goto('/');
			}
		}
	});
</script>

<Toaster />

<form method="POST" use:enhance>
	<label for="email">Email:</label>
	<input type="email" name="email" bind:value={$form.email} {...$constraints.email} />
	<label for="password">Password:</label>
	<input type="password" name="password" bind:value={$form.password} {...$constraints.password} />
	<button>login</button>
</form>
