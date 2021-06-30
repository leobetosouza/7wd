<script>
	import { onMount } from 'svelte';

	import PlayerTableau from './components/player/PlayerTableau.svelte';
	import MainTable from './components/table/MainTable.svelte';
	
	import { agePromise, currentAgeName, playerOne, playerTwo, reserve, discard } from './stores';

	import { createPlayers, setupNextAge } from './actions';

	let isGameStarted = false;

	const startGame = async () => {
		await setupNextAge();

		isGameStarted = true;
	};

	onMount(() => {
		createPlayers(
			{ name: 'Player 1', color: 'red' },
			{ name: 'Player 2', color: 'blue' }
		);
	})

</script>

<main>
	{#if isGameStarted}
		<h1 style="margin: 0">{@html $currentAgeName}</h1>
	{:else}
		<button on:click|once={startGame}>Start Game</button>
	{/if}

	{#if $agePromise}
		{#await $agePromise}
			<p>waiting cards...</p>
		{:then}
		<p style="margin-top: 0">Reserve: {$reserve.length} | Discard: {$discard.length}</p>
		<section class="gametable">
			<PlayerTableau player={$playerOne} />
			<PlayerTableau player={$playerTwo} />
			<MainTable />
		</section>
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 0;
		margin: 0 auto;
		height: 100%;
		overflow: hidden;
	}

	.gametable {
		background: gray;
		display: grid;
		grid-gap: 1rem;

		grid-template-areas: "player1 maintable player2";
		grid-template-columns: 1fr auto 1fr;
	}


	@media (min-width: 640px) {
	}
</style>