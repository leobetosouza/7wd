<script>
  import { militaryLayout } from '../../stores';

  import MilitarySlot from './MilitarySlot.svelte';
</script>

<section class="military-board">
  {#each $militaryLayout as slot, i}
    <MilitarySlot {slot} idx={i} />
  {/each}
</section>

<style>
  .military-board {
    grid-area: military;
    background: linear-gradient(to right, var(--player-one-color), var(--player-two-color));
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
