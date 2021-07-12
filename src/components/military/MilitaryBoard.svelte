<script>
  import { beforeUpdate } from 'svelte';
  import { militaryLayout, conflictPawnIndex } from '../../stores';
  import { checkMilitarySupremacy } from '../../actions';

  import MilitarySlot from './MilitarySlot.svelte';

  beforeUpdate(() => {
    checkMilitarySupremacy()
  });

</script>

<div class="military-board">
  {#each $militaryLayout as slot, i}
    {#if i === $conflictPawnIndex}
      <MilitarySlot {slot} pawn />
    {:else}
      <MilitarySlot {slot} />
    {/if}
  {/each}
</div>

<style>
  .military-board {
    grid-area: military;
    background: crimson;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
