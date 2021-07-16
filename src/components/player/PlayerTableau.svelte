<script>
  import CardPresenter from '../card/CardPresenter.svelte';
  import Effect from '../Effect.svelte';

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
  class="player-tableau player-color-{$color}"
  class:player-tableau-active={$currentPlayer === player}
  class:orientation-left={player.idx === 1}
>
  <div class="player-resources">
    <h1 class="player-name">{$name}</h1>
    <p class="resource-line-counters">
      <Effect isBig effect="coins" value="{$resources.balance}" />
      <Effect isBig effect="vp" value="{$resources.vps}" />
    </p>
    <p class="mini-cards-line">
      <span class="mini-card raw-card" title="{$resources.cards.raw} Raw Material Cards">{$resources.cards.raw}</span>
      <span class="mini-card manufacture-card" title="{$resources.cards.manufacture} Manufacture Cards">{$resources.cards.manufacture}</span>
      <span class="mini-card civic-card" title="{$resources.cards.civic} Civic Cards">{$resources.cards.civic}</span>
      <span class="mini-card military-card" title="{$resources.cards.military} Military Cards">{$resources.cards.military}</span>
      <span class="mini-card trade-card" title="{$resources.cards.trade} Trade Cards">{$resources.cards.trade}</span>
      <span class="mini-card science-card" title="{$resources.cards.science} Science Cards">{$resources.cards.science}</span>
      <span class="mini-card guild-card" title="{$resources.cards.guild} Guild Cards">{$resources.cards.guild}</span>
    </p>
    {#if $resources['foreach-card'].length}
      <p class="resource-line">
        {#each $resources['foreach-card'] as forCard }
          <span class="guild-wrapper">
            <Effect effect="foreach-card" value={forCard} foreachNoCoins />
          </span>
        {/each}
      </p>
    {/if}
    {#if $resources.sciences.length}
      <p class="science-line">
        {#each $resources.sciences as science}
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
    {#if $resources.ors.length}
      <p class="resource-line">
        {#each $resources.ors as or}
          <span class="or-wrapper">
            <Effect effect="or" value={or} />
          </span>
        {/each}
      </p>
    {/if}
    {#each ['wood', 'stone', 'clay', 'glass', 'papyrus'] as resource}
      {#if $resources[resource] || $resources.stocks.includes(resource)}
        <p class="resource-line">
          {#if $resources[resource]}
            <span
              class:raw-wrapper={['wood', 'stone', 'clay'].includes(resource)}
              class:manufacture-wrapper={['glass', 'papyrus'].includes(resource)}
            >
              <Effect effect={resource} value={$resources[resource]} />
            </span>
          {/if}
          {#if $resources.stocks.includes(resource)}
            <span class="stock-wrapper">
              <Effect effect="stock" value={resource} />
            </span>
          {/if}
        </p>
      {/if}
    {/each}
    {#if $resources.chains.length}
      <p class="resource-line">
        {#each $resources.chains as chain}
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
