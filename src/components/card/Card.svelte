<script>
	import { removedCardSlots, activeCards } from '../../stores';
	import { buyCard, sellCard } from '../../actions';

    import CardPresenter from './CardPresenter.svelte';

    export let slot;
	export let slotIndex;
	export let rowName;

	$: hasBeenRemoved = (row, index) =>
        !!$removedCardSlots.find(card => card.row === row && card.index === index);

	$: hasCover = ({ covered_by = [] }) => 
        !!covered_by.length &&
        !covered_by.every(([ row, index ]) => hasBeenRemoved(row, index));

    const handleBuyCard = ({ detail }) => {
        const { card } = detail;
        const slot = { row: rowName, index: slotIndex };

        buyCard({ card, slot });
    };

    const handleSellCard = ({ detail }) => {
        const { card } = detail;
        const slot = { row: rowName, index: slotIndex };

        sellCard({ card, slot });
    };

</script>

{#if slot && !hasBeenRemoved(rowName, slotIndex)}
    <CardPresenter
        on:sell_card={handleSellCard}
        on:buy_card={handleBuyCard}
        blocked={hasCover(slot)}
        card={activeCards.next()}
        turned={slot.turned}
    />
{:else}
    <CardPresenter invisible />
{/if}
