<script>
  import { militaryLayout } from '../../stores';

  import MilitarySlot from './MilitarySlot.svelte';
</script>

<div class="military-board">
  {#each $militaryLayout as slot, i}
    <MilitarySlot {slot} idx={i} />
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
