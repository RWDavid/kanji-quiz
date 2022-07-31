<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { tweened } from 'svelte/motion';
	import type { kanjiData } from '$lib/types';

	export let rounds: number;
	export let timer: number;
	export let kanjiList: kanjiData[];

	let round = 1;
	let roundProgress = 0; // 0 = Initial state; 1 = Timer started; 2 = Timer finished; 3 = Kanji revealed;
	let startTimeout: NodeJS.Timeout;

	$: timerBarWidth = tweened(1, { duration: timer * 1000 });

	function handleStart() {
		timerBarWidth.set(0);
		roundProgress = 1;
		startTimeout = setTimeout(() => (roundProgress = 2), timer * 1000);
	}

	function handleReveal() {
		roundProgress = 3;
	}

	function handleNext() {
		round += 1;
		roundProgress = 0;
		timerBarWidth.set(1, { duration: 0 });
	}

	function handleReload() {
		clearTimeout(startTimeout);
		invalidate($page.url.search).then(() => {
			round = 1;
			roundProgress = 0;
			timerBarWidth.set(1, { duration: 0 });
		});
	}
</script>

<div class="quiz w-full flex flex-col items-center gap-4">
	<div class="prose text-center mt-4">
		<h1 class="text-2xl">{`Round #${round}`}</h1>
	</div>
	<div
		class="card w-5/6 max-w-[var(--main-width)] aspect-square border-base-content border-8 bg-base-300 justify-center items-center"
	>
		{#if roundProgress == 1 || roundProgress == 3}
			<div style="font-size: min(var(--kanji-width), 75vw)">{kanjiList[round - 1].kanji}</div>
		{/if}
	</div>
	<progress
		class="progress progress-primary w-5/6 max-w-[var(--main-width)] h-6"
		value={$timerBarWidth}
		max="1"
	/>
	<div class="flex sm:flex-row flex-col gap-5 w-5/6 max-w-[var(--main-width)] mb-8">
		<div class="flex gap-5 flex-1">
			{#if roundProgress < 2}
				<button
					class={`btn btn-secondary flex-1 ${roundProgress == 1 ? 'btn-disabled' : ''}`}
					on:click={handleStart}>Start</button
				>
			{:else}
				<button
					class={`btn btn-secondary flex-1 ${roundProgress == 3 ? 'btn-disabled' : ''}`}
					on:click={handleReveal}>Reveal</button
				>
			{/if}
			<button
				class={`btn btn-secondary flex-1 ${
					roundProgress != 3 || round == rounds ? 'btn-disabled' : ''
				}`}
				on:click={handleNext}>Next</button
			>
		</div>
		<div class="flex gap-5 flex-1">
			<label
				for="kanji-info-modal"
				class={`btn btn-warning flex-1 ${roundProgress != 3 ? 'btn-disabled' : ''}`}
				>Kanji Info</label
			>
			<button class="btn btn-error flex-1" on:click={handleReload}>Reload</button>
		</div>
	</div>
</div>

<input type="checkbox" id="kanji-info-modal" class="modal-toggle" />
<label for="kanji-info-modal" class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<h3 class="text-xl font-bold mb-6">
			{`Kanji Information: ${kanjiList[round - 1].kanji}`}
		</h3>
		<p class="py-4">
			{`Meaning(s): ${kanjiList[round - 1].meaning.replaceAll(';', '; ')}`}
		</p>
		<p class="py-4">
			{`Kunyomi: ${kanjiList[round - 1].kunyomi || 'none'}`}
		</p>
		<p class="py-4">
			{`Onyomi: ${kanjiList[round - 1].onyomi || 'none'}`}
		</p>
		<p class="py-4">
			{`Grade: ${kanjiList[round - 1].grade}`}
		</p>
		<p class="py-4">
			{`Strokes: ${kanjiList[round - 1].strokes}`}
		</p>
		<p class="py-4">
			{`Frequency ranking: ${kanjiList[round - 1].frequency ?? 'no frequency data'}`}
		</p>
		<p class="py-4">
			{`JLPT Level: ${kanjiList[round - 1].jlpt || 'not in JLPT'}`}
		</p>
	</label>
</label>

<style>
	.quiz {
		--main-width: 36rem;
		--kanji-width: calc(var(--main-width) * 9 / 10);
	}
</style>
