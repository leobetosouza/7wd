<script>
  export let effect;
  export let value;
  export let isMini = false;
  export let isCost = false;
  export let isInset = false;

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
  <span class="card-mini card-mini-{value.type}">
    {#each Object.entries(value.reward) as [e, v]}
      <svelte:self effect={e} value={v} isMini={true} />
    {/each}
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
    background: goldenrod;
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
    background: lime;
    line-height: 1.2rem;
    height: 1.2rem;
    width: 1.2rem;
    font-size: 1.2rem;
    text-align: center;
    vertical-align: middle;
    border: 2px solid #000;
    font-weight: bold;
  }

  .resource-vp {
    background: blue;
    color: #fff;
  }

  .resource-coins {
    background: goldenrod;
    color: #000;
  }

  .resource-debit {
    background: goldenrod;
    border-color: #f00;
    color: #000;
  }

  .resource-glass {
    background: dodgerblue;
  }

  .resource-papyrus {
    background: khaki;
  }

  .resource-stone {
    background: silver;
  }

  .resource-clay {
    background: sandybrown;
  }

  .resource-wood {
    background: sienna;
  }

  .resource-shields {
    background: red;
  }

  .card-mini {
    width: 1rem;
    height: 1.2rem;
    border: 1px solid #666;
    border-radius: 3px;
    position: relative;
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

  .card-mini-raw {
    background-color: brown;
  }

  .card-mini-wonder {
    background-color: #000;
  }

  .card-mini-manufacture {
    background-color: gray;
  }

  .card-mini-civic {
    background-color: blue;
  }

  .card-mini-trade {
    background-color: yellow;
  }

  .card-mini-military {
    background-color: crimson;
  }

  .card-mini-science {
    background-color: green;
  }

  .resource-cost {
    margin-left: 0.1rem;
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
