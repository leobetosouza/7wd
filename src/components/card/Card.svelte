<script>
	import { createEventDispatcher } from 'svelte';

    import CardPresenter from './CardPresenter.svelte';

    export let getCard;
    export let slot;
	export let slotIndex;
	export let rowName;
    export let removedCardSlots;
	
	const dispatch = createEventDispatcher();

    const handleFrontClick = () => {
        dispatch('remove_card', { row: rowName, index: slotIndex });
    };

	$: hasBeenRemoved = (row, index) =>
        !!removedCardSlots.find(card => card.row === row && card.index === index);

	$: hasCover = ({ covered_by = [] }) => 
        !!covered_by.length &&
        !covered_by.every(([ row, index ]) => hasBeenRemoved(row, index));

</script>

{#if slot && !hasBeenRemoved(rowName, slotIndex)}
    <CardPresenter
        onClickFrontCard={handleFrontClick}
        blocked={hasCover(slot)}
        card={getCard()}
        turned={slot.turned}
    />
{:else}
    <CardPresenter invisible />
{/if}
