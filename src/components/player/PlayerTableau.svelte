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
  <div style="background: whitesmoke">
    <h1>{$name}</h1>
    <p>
      <span class="mini-card raw-card" title="Raw Material Cards">{$resources.cards.raw}</span>
      <span class="mini-card manufacture-card" title="Manufacture Cards">{$resources.cards.manufacture}</span>
      <span class="mini-card civic-card" title="Civic Cards">{$resources.cards.civic}</span>
      <span class="mini-card military-card" title="Military Cards">{$resources.cards.military}</span>
      <span class="mini-card trade-card" title="Trade Cards">{$resources.cards.trade}</span>
      <span class="mini-card science-card" title="Science Cards">{$resources.cards.science}</span>
      <span class="mini-card guild-card" title="Guild Cards">{$resources.cards.guild}</span>
    </p>
    <p>
      Coins: {$resources.balance} | Shields: {$resources.shields} | VPs: {$resources.vps}
      <br />
      Stone: {$resources.stone} | Wood: {$resources.wood} | Clay: {$resources.clay}
      <br />
      Glass: {$resources.glass} | Papyrus: {$resources.papyrus}
      <br />
      Different Sciences: {$resources.differentSciences}

    </p>
  </div>
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

  .mini-card {
    display: inline-block;
    padding: .05rem .35rem .15rem .3rem;
    border: 1px solid black;
    border-radius: 3px;
    box-sizing: border-box;
    text-shadow: 1px 1px 0 #fff;
    box-shadow: 1px 1px 0 rgba(0, 0, 0, .3)
  }

  .raw-card {
    background-color: var(--raw-card-color);
  }

  .manufacture-card {
    background-color: var(--manufacture-card-color);
  }

  .civic-card {
    background-color: var(--civic-card-color);
  }

  .trade-card {
    background-color: var(--trade-card-color);
  }

  .military-card {
    background-color: var(--military-card-color);
  }

  .science-card {
    background-color: var(--science-card-color);
  }

  .guild-card {
    background-color: var(--guild-card-color);
  }
</style>
