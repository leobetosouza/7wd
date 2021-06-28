<script>
	import MainTable from './components/table/MainTable.svelte';
	import { get1stAgeCards, get2ndAgeCards, get3rdAgeCards, get1stAgeTableLayout, get2ndAgeTableLayout, get3rdAgeTableLayout } from './services/resources';

	let reserve = [];
	let discard = [];
	let activeCards = [];
	let tableLayout;
	let agePromise;
	let cardCount = 0;

	const getCard = () => activeCards[cardCount++];

	const prepare1stAge = () => {
		const cardsPromise = get1stAgeCards().then(res => {
			reserve = [ ...reserve, ...res.reserve ];
			discard = [ ...discard, ...activeCards];
			activeCards = res.cards;
			cardCount = 0;
		});

		const tableLayoutPromise = get1stAgeTableLayout().then(layout => {
			tableLayout = layout;
		});

		agePromise = Promise.all([ cardsPromise, tableLayoutPromise ]);
	};

	
	const prepare2ndAge = () => {
		const cardsPromise = get2ndAgeCards().then(res => {
			reserve = [ ...reserve, ...res.reserve ];
			discard = [ ...discard, ...activeCards];
			activeCards = res.cards;
			cardCount = 0;
		});

		const tableLayoutPromise = get2ndAgeTableLayout().then(layout => {
			tableLayout = layout;
		});

		agePromise = Promise.all([ cardsPromise, tableLayoutPromise ]);
	};
	
	const prepare3rdAge = () => {
		const cardsPromise = get3rdAgeCards().then(res => {
			reserve = [ ...reserve, ...res.reserve ];
			discard = [ ...discard, ...activeCards];
			activeCards = res.cards;
			cardCount = 0;
		});

		const tableLayoutPromise = get3rdAgeTableLayout().then(layout => {
			tableLayout = layout;
		});

		agePromise = Promise.all([ cardsPromise, tableLayoutPromise ]);
	}


</script>

<main>
	<button on:click|once={prepare1stAge}>1st Age</button>
	<button on:click|once={prepare2ndAge}>2nd Age</button>
	<button on:click|once={prepare3rdAge}>3rd Age</button>

	{#if agePromise}
		{#await agePromise}
			<p>waiting cards...</p>
		{:then}
			<MainTable {tableLayout} {getCard} />
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}


	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>