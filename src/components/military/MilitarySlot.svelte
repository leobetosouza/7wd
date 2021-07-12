<script>
  import Effect from '../Effect.svelte';

  export let slot;
  export let pawn = false;

</script>

<div class="military-slot">
  {#if pawn}
    P
  {:else}
    {#if slot.victory}
      WIN
    {/if}
    {#if slot.vp}
      <Effect isMini effect="vp" value={slot.vp} />
    {/if}
    {#if slot.debit}
      <Effect isMini effect="debit" value={slot.debit} />
    {/if}
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
    justify-content: space-between;
  }

  .slot-footer {
    background: magenta;
  }
</style>
