<script>
	import { Toaster } from 'svelte-french-toast';
</script>

<Toaster />

<form method="POST" action="?/logout"><button>Logout</button></form>

<slot />
