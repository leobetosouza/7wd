<script>
	import { afterUpdate } from 'svelte';
	import { removedCardSlots, activeCards, tableLayout } from '../../stores';

    import Card from '../card/Card.svelte';

	export let onRemoveCard;
	export let onEndAge;

	const removeCard = (event) => {
		const { card, slot } = event.detail;
		removedCardSlots.update(arr => [ slot, ...arr ]);
		onRemoveCard({ card, slot });
	};

	afterUpdate(() => {
		if ($removedCardSlots.length === $activeCards.length) onEndAge();
	})

</script>

<section class="cards-table">
    {#each Object.entries($tableLayout) as [name, row]}
        <div class="table-row {row.shifted ? 'table-row-shifted' : ''}">
            {#each row.slots as slot, i}
                <Card
                    on:tap={removeCard}
                    {slot}
                    rowName={name}
                    slotIndex={i}
                />
            {/each}
        </div>
    {/each}
</section>

<style>

	.cards-table {
		grid-area: maintable;
	}

	.table-row {
		display:flex;
		flex-wrap: wrap;
		justify-content: center;

		position: relative;
	}

	.table-row-shifted {
		left: 5rem;
	}

	.table-row:first-of-type {
		top: 0;
	}

	.table-row:nth-of-type(2) {
		top: -7rem;
	}

	.table-row:nth-of-type(3) {
		top: -14rem;
	}

	.table-row:nth-of-type(4) {
		top: -21rem;
	}

	.table-row:nth-of-type(5) {
		top: -28rem;
	}

	.table-row:nth-of-type(6) {
		top: -36rem;
	}

	.table-row:nth-of-type(7) {
		top: -43rem;
	}

</style>