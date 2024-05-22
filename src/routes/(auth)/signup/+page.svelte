<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { toast } from 'svelte-french-toast';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const {
		form: signUpForm,
		constraints,
		enhance
	} = superForm(data.form, {
		async onUpdated({ form }) {
			console.log(form);
			if (form.valid) {
				toast.success(`${form.data.email} Sign Up Successful`);
				await goto('/');
			}
		}
	});
</script>

<form method="POST" use:enhance>
	<label for="email">Email:</label>
	<input type="email" name="email" bind:value={$signUpForm.email} {...$constraints.email} />

	<label for="password">Password:</label>
	<input
		type="password"
		name="password"
		bind:value={$signUpForm.password}
		{...$constraints.password}
	/>

	<button>Sign Up</button>
</form>
