<script>
  import { get } from 'svelte/store';
  import Effect from '../Effect.svelte';

  import { conflictPawnIndex, currentPlayer } from '../../stores';

  export let slot;
  export let idx;

  let pawn = false;
  let showDebit = false;
  const { player } = slot;
  $: {
    pawn = idx === $conflictPawnIndex;
    showDebit = slot.debit && !$player?.$debitTokens?.includes(slot.debit);
  }

</script>

<div class="military-slot"
  class:military-slot-active={pawn}
  class:military-slot-start={slot.start}
  class:military-slot-victory={slot.victory}
>
  {#if pawn}
    <span class="conflict-pawn">战</span>
  {/if}
  {#if slot.victory && !pawn}
    WIN
  {/if}
  {#if slot.vp}
    <Effect isMini isInset effect="vp" value={slot.vp} />
  {/if}
  {#if showDebit}
    <Effect isMini isInset effect="debit" value={slot.debit} />
  {/if}
</div>

<style>
  .military-slot {
    background: lightcoral;
    width: 3rem;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    box-sizing: border-box;
  }

  .military-slot-start {
    background: bisque;
  }

  .military-slot-victory {
    background: darkred;
    color: white;
    font-weight: bold;
  }

  .conflict-pawn{
    font-weight: bold;
  }

  .military-slot-active {
    border: 3px solid #000;
  }

</style>
