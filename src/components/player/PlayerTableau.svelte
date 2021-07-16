<script>
  import Effect from '../Effect.svelte';

  import { currentPlayer } from '../../stores';

  export let player;
  export let gridArea;

  const {
    name,
    color,
    resources
  } = player;

  $: res = $resources;

</script>

<section  class="player-tableau"
  style="
    --area: {gridArea};
    --player-color: {$color};
  "
  class:player-tableau-active={$currentPlayer === player}
  class:orientation-left={player.idx === 1}
>
  <div class="player-resources">
    <h1 class="player-name">{$name}</h1>
    <p class="resource-line-counters">
      <Effect isBig effect="coins" value="{res.balance}" />
      <Effect isBig effect="vp" value="{res.vps}" />
    </p>
    <p class="mini-cards-line">
      <span class="mini-card raw-card" title="{res.cards.raw} Raw Material Cards">{res.cards.raw}</span>
      <span class="mini-card manufacture-card" title="{res.cards.manufacture} Manufacture Cards">{res.cards.manufacture}</span>
      <span class="mini-card civic-card" title="{res.cards.civic} Civic Cards">{res.cards.civic}</span>
      <span class="mini-card military-card" title="{res.cards.military} Military Cards">{res.cards.military}</span>
      <span class="mini-card trade-card" title="{res.cards.trade} Trade Cards">{res.cards.trade}</span>
      <span class="mini-card science-card" title="{res.cards.science} Science Cards">{res.cards.science}</span>
      <span class="mini-card guild-card" title="{res.cards.guild} Guild Cards">{res.cards.guild}</span>
    </p>
    {#if res['foreach-card'].length}
      <p class="resource-line">
        {#each res['foreach-card'] as forCard }
          <span class="guild-wrapper">
            <Effect effect="foreach-card" value={forCard} foreachNoCoins />
          </span>
        {/each}
      </p>
    {/if}
    {#if res.sciences.length}
      <p class="science-line">
        {#each res.sciences as science}
          {#if Array.isArray(science)}
            <span class="science-wrapper">
              <Effect effect="science" value={science[0]} />
              <Effect effect="science" value={science[0]} />
            </span>
          {:else}
            <span class="science-wrapper">
              <Effect effect="science" value={science} isColumn />
            </span>
          {/if}
        {/each}
      </p>
    {/if}
    {#if res.ors.length}
      <p class="resource-line">
        {#each res.ors as or}
          <span class="or-wrapper">
            <Effect effect="or" value={or} />
          </span>
        {/each}
      </p>
    {/if}
    {#each ['wood', 'stone', 'clay', 'glass', 'papyrus'] as resource}
      {#if res[resource] || res.stocks.includes(resource)}
        <p class="resource-line">
          {#if res[resource]}
            <span
              class:raw-wrapper={['wood', 'stone', 'clay'].includes(resource)}
              class:manufacture-wrapper={['glass', 'papyrus'].includes(resource)}
            >
              <Effect effect={resource} value={res[resource]} />
            </span>
          {/if}
          {#if res.stocks.includes(resource)}
            <span class="stock-wrapper">
              <Effect effect="stock" value={resource} />
            </span>
          {/if}
        </p>
      {/if}
    {/each}
    {#if res.chains.length}
      <p class="resource-line">
        {#each res.chains as chain}
          <Effect effect="chain" isCost value={chain} />
        {/each}
      </p>
    {/if}
  </div>
  <!-- <div class="card-stack">
    {#each $tableau as card, i}
      <div class="card-wraper" style="--top:-{10 * i}rem">
        <CardPresenter {card} noActions />
      </div>
    {/each}
  </div> -->
</section>

<style>
  .player-tableau {
    grid-area: var(--area);
    background: var(--player-color);
    border: 5px solid var(--player-color);
  }

  .player-name {
    font-size: 1.5rem;
  }

  .player-resources {
    opacity: .8;
    background: rgba(252, 242, 242, .5);
    border: .5rem solid rgba(252, 242, 242, .5);
    padding: 1px .5rem .5rem;
  }
  .player-tableau-active .player-resources {
    opacity: 1;
    background: rgba(252, 242, 242, .8);
    border-color: white;
  }

  .resource-line-counters {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 2rem;
  }

  .science-line,
  .resource-line {
    display: flex;
    flex-flow: wrap;
    justify-content: flex-end;
    align-items: center;
    margin: 0 0rem .5rem;
  }

  .science-line {
    align-items: flex-start;
  }

  .orientation-left .resource-line {
    flex-direction: row-reverse;
  }

  .orientation-left .science-line {
    justify-content: flex-start;
  }

  .resource-line > * {
    margin: 0 .2rem;
  }

  .or-wrapper,
  .stock-wrapper,
  .raw-wrapper,
  .manufacture-wrapper,
  .science-wrapper ,
  .guild-wrapper{
    display: flex;
    padding: .2rem;
    border: 1px solid #000;
    margin: 0 .2em;
  }

  .science-wrapper {
    flex-direction: column;
    padding: .1rem .2rem;
    background: var(--science-card-color);
  }

  .or-wrapper,
  .stock-wrapper {
    background: var(--trade-card-color);
  }

  .raw-wrapper {
    background: var(--raw-card-color);
  }

  .manufacture-wrapper {
    background: var(--manufacture-card-color);
  }

  .guild-wrapper {
    background: var(--guild-card-color);
  }

  /* .card-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card-wraper {
    position: relative;
    top: var(--top);
    z-index: 1;
  } */

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
