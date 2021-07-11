<script>
  import Effect from '../Effect.svelte';
  export let cost;
</script>

{#if cost}
  <div class="card-cost">
    {#each Object.entries(cost).filter(([k]) => k !== 'chain') as [effect, value]}
      <Effect {effect} {value} isCost />
    {/each}
  </div>
  {#if cost.chain}
    <div class="card-cost">
      <Effect effect="chain" value={cost.chain} isCost />
    </div>
  {/if}
{/if}

<style>
  .card-cost {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin: 0.5rem 0;
  }
</style>
