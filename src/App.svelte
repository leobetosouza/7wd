<script>
	import MainTable from './components/table/MainTable.svelte';
	import { get1stAgeCards, get2ndAgeCards, get3rdAgeCards, get1stAgeTableLayout, get2ndAgeTableLayout, get3rdAgeTableLayout } from './services/resources';

	let reserve = [];
	let discard = [];
	let activeCards = [];
	let tableLayout;
	let agePromise;
	let cardCount = 0;
	let currentAgeName;
	let isGameStarted = false;

	let historyStack = [];

	const getCard = () => activeCards[cardCount++];

	const pushHistory = action => {
		historyStack = [action, ...historyStack];
	};

	const handleRemoveCard = cardSlot => {
		pushHistory(cardSlot);
	};

	const prepareAge = (getAgeCards, getTableLayout) => async () => {
		const cardsPromise = getAgeCards().then(res => {
			reserve = [ ...reserve, ...res.reserve ];
			discard = [ ...discard, ...activeCards];
			activeCards = res.cards;
			cardCount = 0;
		});

		const tableLayoutPromise = getTableLayout().then(layout => {
			tableLayout = layout;
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

			pushHistory({
				reserve: [...reserve],
				activeCards: [...activeCards]
			});
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
		<h1>{@html currentAgeName}</h1>
	{:else}
		<button on:click|once={startGame}>Start Game</button>
	{/if}

	{#if agePromise}
		{#await agePromise}
			<p>waiting cards...</p>
		{:then}
			<MainTable {onEndAge} onRemoveCard={handleRemoveCard} {tableLayout} {getCard} totalCards={activeCards.length} />
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
	}


	@media (min-width: 640px) {
	}
</style>