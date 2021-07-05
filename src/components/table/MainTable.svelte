<script>
	import { afterUpdate } from 'svelte';
	import { removedCardSlots, activeCards, tableLayout } from '../../stores';

    import Card from '../card/Card.svelte';

	import { setupNextAge } from '../../actions';

	afterUpdate(() => {
		if ($removedCardSlots.length === $activeCards.length) setupNextAge();
	})

</script>

<section class="cards-table">
    {#each Object.entries($tableLayout) as [name, row], i}
        <div style="--row-top-correction: { -7 * i }rem" class="table-row {row.shifted ? 'table-row-shifted' : ''}">
            {#each row.slots as slot, j}
                <Card
                    {slot}
                    rowName={name}
                    slotIndex={j}
					templateLine={i}
                />
            {/each}
        </div>
    {/each}
</section>

<style>

	.cards-table {
		grid-area: maintable;
		padding-top: 1rem;
	}

	.table-row {
		display:flex;
		flex-wrap: wrap;
		justify-content: center;
		position: relative;
		top: var(--row-top-correction);
	}

	.table-row-shifted {
		left: 5rem;
	}

</style>