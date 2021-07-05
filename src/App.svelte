<script>
	import { beforeUpdate, onMount } from 'svelte';

	import PlayerTableau from './components/player/PlayerTableau.svelte';
	import MainTable from './components/table/MainTable.svelte';
	import EndGameTable from './components/endgame/EndGameTable.svelte';
	import MilitaryBoard from './components/MilitaryBoard.svelte';
	
	import { currentPlayer, agePromise, currentAgeName, playerOne, playerTwo, reserve, discard, hasGameEnded } from './stores';

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

		startGame();
	});

	beforeUpdate(() => {
		if ($hasGameEnded) {
			console.log("FIM DO JOGO")
		}
	})

</script>

<main>
	{#if !isGameStarted}
		<button on:click|once={startGame}>Start Game</button>
	{/if}

	{#if $agePromise}
		{#await $agePromise}
			<p>waiting cards...</p>
		{:then}
				<section class="gametable" style="--bgcolor:{$currentPlayer.getColor()}">
					<header class="header">
						<h1 style="margin: 0">{@html ($hasGameEnded ? 'GAME&apos;s END' : $currentAgeName)}</h1>
						Reserve: {$reserve.length} | Discard: {$discard.length}
					</header>
					<PlayerTableau player={$playerOne} gridArea="player1" />
					<PlayerTableau player={$playerTwo} gridArea="player2"/>
					<MilitaryBoard />
					{#if $hasGameEnded}
						<EndGameTable />
					{:else}
						<MainTable />
					{/if}
					<footer class="footer">
						7WD
					</footer>
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
		background: var(--bgcolor);
		display: grid;
		
		grid-template-areas: "header header header" "player1 military player2" "player1 maintable player2" "footer footer footer";
		grid-template-columns: 15% auto 15%;
		grid-template-rows: 8% 5% auto 3%;

		justify-content: stretch;

		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.header	{
		grid-area: header;
		background: #fff;
		text-align: center;
		padding: 8px 0;
	}

	.footer	{
		grid-area: footer;
		background: #000;
		color: #fff;
		text-align: center;
	}


	@media (min-width: 640px) {
	}
</style>