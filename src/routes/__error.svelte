<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = function ({ error, status }) {
		return {
			props: {
				status: status ?? 500,
				message: error?.message ?? 'Undefined error'
			}
		};
	};
</script>

<script lang="ts">
	export let status: number;
	export let message: string;
</script>

<div class="w-full grow flex flex-col p-5">
	<div class="prose max-w-none mt-6 text-center">
		<h1 class="text-5xl">{`Error (${status})`}</h1>
		<p class="text-lg">{message}</p>
	</div>
</div>
