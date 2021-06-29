<script>
	import { beforeUpdate } from 'svelte';

	import CardEffects from './CardEffects.svelte';
	import CardCost from './CardCost.svelte';

    export let card = null;
	export let invisible = false;
	export let onClickFrontCard = null;

	export let turned = false;
	export let blocked = false;

	beforeUpdate(() => {
		if (!blocked) turned = false;
	});

	const handleClick = () => {
		if (!blocked) onClickFrontCard(card);
	}

</script>

{#if invisible}
	<div class="card card-invisible">&nbsp</div>
{:else}
	<div class="card {blocked ? 'card-blocked' : ''}">
		{#if turned}
			<div class="card-back {card.type === 'guild' ? 'card-age-guild' : `card-age-${card.age}`}">
				<p class="card-age">{card.type === 'guild' ? 'G' : card.age}</p>
			</div>
		{:else}
			<div class="card-front card-type-{card.type}" on:click={handleClick}>
				<h1 class="card-name">{card.name}</h1>
				<CardEffects effects={card.effects} />
				<CardCost cost={card.cost} />
			</div>
		{/if}
	</div>
{/if}

<style>
	.card {
		position: relative;
		z-index: 1;
		border: 5px solid #000;
		border-radius: 5px;
		margin: 1rem;
		overflow: hidden;

		width: 7.5rem;
		height: 10rem;

		cursor: pointer;
	}

	.card-blocked {
		cursor: not-allowed;
	}

	.card-invisible {
		visibility: hidden;
		z-index: 0;
		width: 7.5rem;
	}

	.card-back,
	.card-front {
		width: 100%;
		height: 100%;
	}

	.card-age,
	.card-name {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		margin: 0;
		background: pink;
		white-space: nowrap;
		font-size: .6rem;
		font-weight: bold;
		padding: .3rem 0;
	}


	.card-type-raw {
		background-color: brown;
	}

	.card-type-manufacture {
		background-color: gray;
	}

	.card-type-civic {
		background-color: blue;
	}

	.card-type-trade {
		background-color: yellow;
	}

	.card-type-military {
		background-color: crimson;
	}

	.card-type-science {
		background-color: green;
	}

	.card-type-guild {
		background-color: purple;
	}

	.card-age-1 {
		background-color: saddlebrown;
	}

	.card-age-2 {
		background-color: royalblue;
	}

	.card-age-3 {
		background-color: blueviolet;
	}

	.card-age-guild {
		background-color: violet;
	}

</style>