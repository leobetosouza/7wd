<script>
	import { createEventDispatcher } from 'svelte';
	import { removedCardSlots, activeCards } from '../../stores';

    import CardPresenter from './CardPresenter.svelte';

    export let slot;
	export let slotIndex;
	export let rowName;
	
	const dispatch = createEventDispatcher();

    const handleFrontClick = card => {
        dispatch('tap', { card, slot: { row: rowName, index: slotIndex } });
    };

	$: hasBeenRemoved = (row, index) =>
        !!$removedCardSlots.find(card => card.row === row && card.index === index);

	$: hasCover = ({ covered_by = [] }) => 
        !!covered_by.length &&
        !covered_by.every(([ row, index ]) => hasBeenRemoved(row, index));

</script>

{#if slot && !hasBeenRemoved(rowName, slotIndex)}
    <CardPresenter
        onClickFrontCard={handleFrontClick}
        blocked={hasCover(slot)}
        card={activeCards.next()}
        turned={slot.turned}
    />
{:else}
    <CardPresenter invisible />
{/if}
