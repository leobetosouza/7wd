<script>
	import PlayerTableau from './components/player/PlayerTableau.svelte';
	import MainTable from './components/table/MainTable.svelte';
	import { get1stAgeCards, get2ndAgeCards, get3rdAgeCards, get1stAgeTableLayout, get2ndAgeTableLayout, get3rdAgeTableLayout } from './services/resources';

	import { activeCards, reserve, discard, tableLayout } from './stores';
	import Player from './stores/player';

	let agePromise;
	let currentAgeName;
	let isGameStarted = false;

	const playerOne = Player({ name: 'Player 1', color: 'red' });
	const playerTwo = Player({ name: 'Player 2', color: 'blue' });

	const playerControl = (() => {
		const players = [ playerOne, playerTwo ];
		let n = Math.random() >= 0.5 ? 1 : 0;
		
		const idx = (function* () {
			while (true) {
				n = n ? 0 : 1;
				yield n;
			}
		})();

		return {
			getCurrent: () => players[n],
			getNext: () => players[idx.next().value],
			setNext: (x) => n = !(x-1) ? 1 : 0
		};

	})();

	let currentPlayer = playerControl.getCurrent();

	const handleRemoveCard = ({ card, slot }) => {
		currentPlayer.takeCard(card);
		currentPlayer = playerControl.getNext();
	};

	const prepareAge = (getAgeCards, getTableLayout) => async () => {
		const cardsPromise = getAgeCards().then(res => {
			reserve.add(...res.reserve);
			activeCards.set(res.cards);
		});

		const tableLayoutPromise = getTableLayout().then(layout => {
			tableLayout.set(layout);
		});

		agePromise = Promise.all([ cardsPromise, tableLayoutPromise ]);

		return agePromise;
	};

	const agesList = [
		{
			name: '1st Age',
			prepare: prepareAge(get1stAgeCards, get1stAgeTableLayout),
		},
		{
			name: '2nd Age',
			prepare: prepareAge(get2ndAgeCards, get2ndAgeTableLayout),
		},
		{
			name: '3rd Age',
			prepare: prepareAge(get3rdAgeCards, get3rdAgeTableLayout),
		}
	];

	const ages = (function* () {
		let count = 0;
		while (count !== agesList.length) yield agesList[count++];
	})();

	const setupNextAge = async () => {
		const age = ages.next();
		
		if (!age.done) {
				
			await age.value.prepare();

			currentAgeName = age.value.name;
		} else {
			currentAgeName = 'GAME&apos;s END';
		}	
	};

	const startGame = async () => {
		await setupNextAge();

		isGameStarted = true;
	};

	const onEndAge = () => {
		setupNextAge();
	};

</script>

<main>
	{#if isGameStarted}
		<h1 style="margin: 0">{@html currentAgeName}</h1>
	{:else}
		<button on:click|once={startGame}>Start Game</button>
	{/if}

	{#if agePromise}
		{#await agePromise}
			<p>waiting cards...</p>
		{:then}
		<p style="margin-top: 0">Reserve: {$reserve.length} | Discard: {$discard.length}</p>
		<section class="gametable">
			<PlayerTableau player={playerOne} active={playerOne === currentPlayer} />
			<PlayerTableau player={playerTwo} active={playerTwo === currentPlayer} />
			<MainTable {onEndAge} onRemoveCard={handleRemoveCard} />
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