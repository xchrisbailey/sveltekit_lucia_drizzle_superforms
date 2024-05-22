<script lang="ts">
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';

	export let data: PageData;

	const { form, constraints, enhance } = superForm(data.form, {
		applyAction: false,
		async onResult({ result }) {
			if (result.type === 'success') {
				toast.success('Logged In!');
				await goto('/');
			}
		}
	});
</script>

<form method="POST" use:enhance>
	<label for="email">Email:</label>
	<input type="email" name="email" bind:value={$form.email} {...$constraints.email} />
	<label for="password">Password:</label>
	<input type="password" name="password" bind:value={$form.password} {...$constraints.password} />
	<button>login</button>
</form>
