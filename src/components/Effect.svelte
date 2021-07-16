<script>
  export let effect;
  export let value;
  export let isMini = false;
  export let isBig = false;
  export let isCost = false;
  export let isInset = false;
  export let isColumn = false;
  export let foreachNoCoins = false;

  const chainsTable = {
    gear: 'A',
    tower: 'B',
    water: 'C',
    drama: 'D',
    sword: 'E',
    horseshoe: 'F',
    luna: 'G',
    jar: 'H',
    book: 'Y',
    pillar: 'J',
    harp: 'K',
    barrel: 'L',
    sun: 'M',
    helmet: 'N',
    temple: 'O',
    lamp: 'P',
    target: 'Q',
  };

  const sciencesTable = {
    pestle: '&Theta;',
    plummet: '&Delta;',
    witring: '&Omega;',
    wheel: '&Phi;',
    sundial: '&Sigma;',
    astrolabe: '&Pi;',
    laws: '&Psi;',
  };

  const resourcesTable = {
    wood: '木',
    stone: '石',
    clay: '垆',
    glass: '玻',
    papyrus: '纸',
    shields: '战',
  };
</script>

{#if ['wood', 'clay', 'stone', 'glass', 'papyrus', 'shields'].includes(effect)}
  {#each Array(value) as _}
    <span
      class="resource resource-{effect}"
      class:resource-cost={isCost}
      class:resource-big={isBig}
      title={effect}>{resourcesTable[effect]}</span
    >
  {/each}
{/if}
{#if ['vp', 'coins'].includes(effect)}
  <span
    class="resource-number resource-{effect}"
    class:resource-cost={isCost}
    class:resource-mini={isMini}
    class:resource-inset={isInset}
    class:resource-big={isBig}
    title="{value} {effect === 'vp' ? 'victory points' : effect}">{value}</span
  >
{/if}
{#if effect === 'debit'}
  <span
    class="resource-number resource-debit"
    class:resource-cost={isCost}
    class:resource-mini={isMini}
    class:resource-inset={isInset}
    title="Debit of -{value}">{value}</span
  >
{/if}
{#if effect === 'science'}
  <span
    class="resource-science resource-science-{value}"
    class:resource-column={isColumn}
    title="science symbol {value}">{@html sciencesTable[value]}</span
  >
{/if}
{#if effect === 'stock'}
  {#if Array.isArray(value)}
    {#each value as v}
      <svelte:self effect="stock" value={v} />
    {/each}
  {:else}
    <span
      class="resource resource-stock resource-{value}"
      title="Stock of {value}">{resourcesTable[value]}</span
    >
  {/if}
{/if}
{#if effect === 'or'}
  {#each Object.entries(value) as [e, v], i}
    {#if i}/{/if}<svelte:self effect={e} value={v} />
  {/each}
{/if}
{#if effect === 'chain'}
  <span
    class="resource-chain resource-chain-{value} {isCost
      ? 'resource-cost'
      : 'resource-chain-top'}"
    title="chain symbol {value}">{chainsTable[value]}</span
  >
{/if}
{#if effect === 'foreach-card'}
  <span class="card-mini card-mini-{value.type}"
      class:card-mini-two-cities={value.where === 'most-of-type-city'}
  >
    {#if value.where === 'most-of-type-city'}+{/if}
    {#if foreachNoCoins}
      {#each Object.entries(value.reward).filter(([key]) => key !== "coins") as [e, v]}
        <svelte:self effect={e} value={v} isMini={true} />
      {/each}
    {:else}
      {#each Object.entries(value.reward) as [e, v]}
        <svelte:self effect={e} value={v} isMini={true} />
      {/each}
    {/if}
  </span>
{/if}

<style>
  .resource-chain {
    background: #fff;
    line-height: 1.2rem;
    height: 1.2rem;
    width: 1.2rem;
    font-size: 0.8rem;
    text-align: center;
    vertical-align: middle;
    border: 2px solid #000;
    font-weight: bold;
  }
  .resource-chain-top {
    position: absolute;
    top: 0;
    right: 0;
    border-top: 0;
    border-right: 0;
  }

  .resource {
    margin: 0 .1rem;
    width: 1.1rem;
    height: 1.1rem;
    line-height: 1.1rem;
    font-size: 0.8rem;
    text-align: center;
    vertical-align: middle;
    border: 2px solid #000;
    color: #000;
  }

  .resource-number {
    border: 2px solid #000;
    font-size: 0.8rem;
    line-height: 1.2rem;
    width: 1.2rem;
    height: 1.2rem;
    text-align: center;
    vertical-align: middle;
    border-radius: 50%;
  }

  .resource-stock {
    position: relative;
  }
  .resource-stock::before {
    content: '1';
    background: var(--stock-color);
    color: #000;

    position: absolute;
    top: -0.9rem;
    left: 0.8rem;

    transform: scale(0.7);

    border: 2px solid #000;
    font-size: 0.8rem;
    line-height: 1.2rem;
    width: 1.2rem;
    height: 1.2rem;
    vertical-align: middle;
    border-radius: 50%;
  }

  .resource-science {
    background: var(--science-color);
    line-height: 1.2rem;
    height: 1.2rem;
    width: 1.2rem;
    font-size: 1.2rem;
    text-align: center;
    vertical-align: middle;
    border: 2px solid #000;
    font-weight: bold;
  }

  .resource-science.resource-column {
    margin: .1rem 0;
  }

  .resource-vp {
    background: var(--vps-color);
    color: #fff;
  }

  .resource-coins {
    background: var(--coins-color);
    color: #000;
  }

  .resource-debit {
    background: var(--coins-color);
    border-color: #f00;
    color: #000;
  }

  .resource-glass {
    background: var(--glass-color);
  }

  .resource-papyrus {
    background: var(--papyrus-color);
  }

  .resource-stone {
    background: var(--stone-color);
  }

  .resource-clay {
    background: var(--clay-color);
  }

  .resource-wood {
    background: var(--wood-color);
  }

  .resource-shields {
    background: var(--shields-color);
  }

  .card-mini {
    width: 1rem;
    height: 1.2rem;
    border: 1px solid #666;
    border-radius: 3px;
    position: relative;
    line-height: 1;
    color: white;
  }

  .card-mini-two-cities:before {
    content: '‹';
    position: absolute;
    font-weight: bold;
    top: 50%;
    left: -.5rem;
    margin-top: -.7rem;
    color: white;
  }

  .card-mini-two-cities:after {
    content: '›';
    position: absolute;
    font-weight: bold;
    top: 50%;
    right: -.5rem;
    margin-top: -.7rem;
    color: white;
  }

  .resource-mini {
    transform: scale(0.7);
    position: absolute;
    bottom: -1.1rem;
  }

  .resource-mini.resource-coins {
    left: -1rem;
  }
  .resource-mini.resource-vp {
    right: -1rem;
  }

  .resource-big {
    transform: scale(1.6);
  }

  .card-mini-raw {
    background-color: var(--raw-card-color);
  }

  .card-mini-wonder {
    background-color: var(--wonder-card-color);
  }

  .card-mini-manufacture {
    background-color: var(--manufacture-card-color);
  }

  .card-mini-civic {
    background-color: var(--civic-card-color);
  }

  .card-mini-trade {
    background-color: var(--trade-card-color);
  }

  .card-mini-military {
    background-color: var(--military-card-color);
  }

  .card-mini-science {
    background-color: var(--science-card-color);
  }

  .resource-cost {
    transform: scale(0.8);
  }

  .resource-inset {
    bottom: -0.2rem;
  }

  .resource-vp.resource-inset {
    right: -0.16rem;
  }

  .resource-debit.resource-inset {
    left: -0.15rem;
  }
</style>
