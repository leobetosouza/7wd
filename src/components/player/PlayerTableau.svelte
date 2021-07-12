<script>
  import CardPresenter from '../card/CardPresenter.svelte';

  import { currentPlayer } from '../../stores';

  export let player;
  export let gridArea;

  const {
    name,
    color,
    tableau,
    resources
  } = player;

</script>

<section
  style="--area: {gridArea}"
  class="player-tableau player-color-{$color} {$currentPlayer === player
    ? 'player-tableau-active'
    : ''}"
>
  <h1>{$name}</h1>
  <p style="background: whitesmoke">
    Cards: {$tableau.length}
    <br />
    Coins: {$resources.balance} | Shields: {$resources.shields} | VPs: {$resources.vps}
    <br />
    Stone: {$resources.stone} | Wood: {$resources.wood} | Clay: {$resources.clay}
    <br />
    Glass: {$resources.glass} | Papyrus: {$resources.papyrus}
    <br />
    Different Sciences: {$resources.differentSciences}
  </p>
  <div class="card-stack">
    {#each $tableau as card, i}
      <div class="card-wraper" style="--top:-{10 * i}rem">
        <CardPresenter {card} noActions />
      </div>
    {/each}
  </div>
</section>

<style>
  .player-tableau {
    grid-area: var(--area);
    overflow: hidden;
  }
  .player-color-red {
    background: red;
    border: 5px solid red;
  }
  .player-color-blue {
    background: blue;
    border: 5px solid blue;
  }
  .player-tableau-active {
    border-color: lightgreen;
  }

  .card-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card-wraper {
    position: relative;
    top: var(--top);
    z-index: 1;
  }
</style>
