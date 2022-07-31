<script lang="ts">
	import {
		MIN_ROUNDS,
		MAX_ROUNDS,
		MIN_TIMER,
		MAX_TIMER,
		MIN_DIFFICULTY,
		MAX_DIFFICULTY
	} from '$lib/constants';

	let metric: string = 'strokes';
	let rounds: number = 10; // Range [5, 20] (represents number of kanji shown)
	let timer: number = 5; // Range [1, 10] (represents seconds of visibility)
	let difficulty: number = 1; // Range [1, 4] (represents starting point of difficulty range)
	$: queryString = `?metric=${metric}&rounds=${rounds}&timer=${timer}&difficulty=${difficulty}`;

	let difficulties: number[] = [];
	for (let i = MIN_DIFFICULTY; i <= MAX_DIFFICULTY; i++) {
		difficulties.push(i);
	}
</script>

<div class="w-full flex flex-col p-5">
	<div class="prose max-w-none m-6 text-center">
		<h1 class="text-5xl">Quiz Configuration</h1>
	</div>
	<div class="self-center card bg-base-300 w-11/12 max-w-[28rem] shadow-lg my-6">
		<div class="card-body">
			<p class="text-lg font-bold">Difficulty Metric</p>
			<div class="bg-base-200 px-4 py-2 rounded-lg">
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text font-semibold">Stroke Count</span>
						<input
							type="radio"
							name="difficulty-metric"
							class="radio checked:bg-primary"
							bind:group={metric}
							value={'strokes'}
						/>
					</label>
				</div>
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text font-semibold">Frequency</span>
						<input
							type="radio"
							name="difficulty-metric"
							class="radio checked:bg-primary"
							bind:group={metric}
							value={'frequency'}
						/>
					</label>
				</div>
			</div>

			<p class="text-lg font-bold">{`Number of Rounds: ${rounds}`}</p>
			<input
				type="range"
				min={MIN_ROUNDS}
				max={MAX_ROUNDS}
				bind:value={rounds}
				class="range range-primary"
				step="1"
			/>

			<p class="text-lg font-bold">{`Seconds of Visibility: ${timer}`}</p>
			<input
				type="range"
				min={MIN_TIMER}
				max={MAX_TIMER}
				bind:value={timer}
				class="range range-primary"
				step="1"
			/>

			<p class="text-lg font-bold">{`Difficulty Level: ${difficulty}`}</p>
			<div class="btn-group flex-nowrap">
				{#each difficulties as level}
					<input
						type="radio"
						name="difficulty"
						bind:group={difficulty}
						value={level}
						data-title={level}
						class="btn flex-1"
					/>
				{/each}
			</div>

			<div class="divider" />

			<a href={`/quiz${queryString}`} class="btn btn-secondary text-lg">Start</a>
		</div>
	</div>
</div>
