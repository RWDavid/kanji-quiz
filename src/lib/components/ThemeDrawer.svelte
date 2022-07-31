<script lang="ts">
	import { browser } from '$app/env';

	export let theme: string;

	function handleThemeSelect(choice: string) {
		theme = choice;
		if (browser) {
			document.cookie = `theme=${choice}; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
		}
	}
	const themes: string[] = [
		'light',
		'dark',
		'cupcake',
		'bumblebee',
		'emerald',
		'corporate',
		'synthwave',
		'retro',
		'cyberpunk',
		'valentine',
		'halloween',
		'garden',
		'forest',
		'aqua',
		'lofi',
		'pastel',
		'fantasy',
		'wireframe',
		'black',
		'luxury',
		'dracula',
		'cmyk',
		'autumn',
		'business',
		'acid',
		'lemonade',
		'night',
		'coffee',
		'winter'
	];
</script>

<div class="drawer drawer-end">
	<input id="theme-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<slot />
	</div>
	<div class="drawer-side">
		<label for="theme-drawer" class="drawer-overlay" />
		<ul class="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content text-xl font-bold gap-2">
			{#each themes as choice}
				<li>
					<button
						on:click={() => handleThemeSelect(choice)}
						class={`btn btn-ghost ${theme === choice ? 'btn-active' : ''}`}
					>
						{choice}
					</button>
				</li>
			{/each}
		</ul>
	</div>
</div>
