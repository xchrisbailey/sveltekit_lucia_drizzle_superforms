<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, constraints, enhance } = superForm(data.form);
</script>

<form method="POST" use:enhance>
	<label for="email">Email:</label>
	<input type="email" name="email" bind:value={$form.email} {...$constraints.email} />

	<label for="password">Password:</label>
	<input type="password" name="password" bind:value={$form.password} {...$constraints.password} />

	<button>Sign Up</button>
</form>
