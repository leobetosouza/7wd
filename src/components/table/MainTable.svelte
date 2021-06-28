<script>
    import Card from '../card/Card.svelte';

    export let tableLayout;
    export let getCard;

	let removedCardSlots = [];

	const removeCard = event => {
		removedCardSlots = [ event.detail, ...removedCardSlots ];
	};

</script>

<section class="cards-table">
    {#each Object.entries(tableLayout) as [name, row]}
        <div class="table-row {row.shifted ? 'table-row-shifted' : ''}">
            {#each row.slots as slot, i}
                <Card
                    on:remove_card={removeCard}
                    {slot}
                    {getCard}
                    rowName={name}
                    slotIndex={i}
                    removedCardSlots={removedCardSlots}
                />
            {/each}
        </div>
    {/each}
</section>

<style>


	.table-row {
		display:flex;
		flex-wrap: wrap;
		justify-content: flex-start;

		position: relative;
	}

	.table-row-shifted {
		left: 5em;
	}

	.table-row:first-of-type {
		top: 0;
	}

	.table-row:nth-of-type(2) {
		top: -7em;
	}

	.table-row:nth-of-type(3) {
		top: -14em;
	}

	.table-row:nth-of-type(4) {
		top: -21em;
	}

	.table-row:nth-of-type(5) {
		top: -28em;
	}

	.table-row:nth-of-type(6) {
		top: -36em;
	}

	.table-row:nth-of-type(7) {
		top: -43em;
	}

</style>