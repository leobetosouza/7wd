<script>
  export let player;
  export let points;
  export let winer = false;
  export let scientific = false;
  export let military = false;

  const { name, color } = player;
</script>

<section
  class="result-table"
  class:winer-table={winer}
  style="
    --player-color: {$color};
  "
>
  {#if winer}
    <h1 class="player-name">{$name} wins!</h1>
  {:else}
    <h1 class="player-name">{$name}</h1>
  {/if}
  {#if scientific}
    {#if winer}Science Supremacy{:else}&mdash;{/if}
  {:else if military}
    {#if winer}Military Supremacy{:else}&mdash;{/if}
  {:else}
    {#if winer}Civic Victory{/if} {points} VPs
  {/if}
</section>

<style>
  .result-table {
    padding: 1.5rem;
    background: var(--player-color);
    border: 5px solid var(--player-color);
  }

  .player-name {
    font-size: 1.17rem;
  }

  .winer-table {
    font-size: 2rem;
  }
</style>
