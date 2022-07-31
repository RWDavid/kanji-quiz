<script lang="ts">
	import '../app.css';
	import { session } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ThemeDrawer from '$lib/components/ThemeDrawer.svelte';

	let theme: string = $session.theme;
</script>

<body data-theme={theme}>
	<ThemeDrawer bind:theme>
		<div class="flex flex-col min-h-screen">
			<Navbar />

			<main class="grow">
				<slot />
			</main>

			<Footer />
		</div>
	</ThemeDrawer>
</body>
