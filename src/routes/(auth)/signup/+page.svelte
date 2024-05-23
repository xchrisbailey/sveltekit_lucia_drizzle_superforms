<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-french-toast';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const {
		form: signUpForm,
		constraints,
		enhance
	} = superForm(data.form, {
		applyAction: false,
		async onResult({ result }) {
			if (result.type === 'success') {
				toast.success(`${result.data?.email} Signed Up Successful`);
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
