<script>
  import Effect from '../Effect.svelte';
  export let effects;
</script>

<div class="card-effects">
  {#each Object.entries(effects) as [effect, value]}
    <Effect {effect} {value} />
  {/each}
</div>

<style>
  .card-effects {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0.6rem 1.1rem 0.9rem;
    position: relative;
    border-bottom: 1px dotted #000;
  }
</style>
