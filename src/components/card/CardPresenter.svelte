<script>
  import { beforeUpdate, createEventDispatcher } from 'svelte';

  import { currentPlayer } from '../../stores';

  import CardEffects from './CardEffects.svelte';
  import CardCost from './CardCost.svelte';
  import CardBuyButton from './CardBuyButton.svelte';

  export let card = null;
  export let invisible = false;
  export let templateLine = 0;

  export let turned = false;
  export let blocked = false;
  export let noActions = false;

  let scaled = false;

  const zoomCard = () => {
    scaled = true;
  };

  const cancelZoom = () => {
    scaled = false;
  };

  beforeUpdate(() => {
    if (!blocked) turned = false;
  });

  const dispatch = createEventDispatcher();

  const handleSellCard = () => {
    dispatch('sell_card', { card });
  };

  const handleBuyCard = () => {
    dispatch('buy_card', { card });
  };

  let zoomCorrection = (templateLine - 3) * -1;
</script>

{#if invisible}
  <div class="card card-invisible">&nbsp</div>
{:else}
  <div
    style="--zoom-top:{zoomCorrection}rem"
    class="card {scaled ? 'card-zoom' : ''} {turned ? 'card-blocked' : ''}"
  >
    {#if turned}
      <div
        class="card-back {card.type === 'guild'
          ? 'card-age-guild'
          : `card-age-${card.age}`}"
      >
        <p class="card-age">{card.type === 'guild' ? 'G' : card.age}</p>
      </div>
    {:else}
      <div class="card-front card-type-{card.type}" on:click={zoomCard}>
        <h1 class="card-name">{card.name}</h1>
        <CardEffects effects={card.effects} />
        <CardCost cost={card.cost} />
        {#if scaled}
          <div class="card-actions">
            {#if !noActions}
              {#if !blocked}
                <CardBuyButton
                  onClick={handleBuyCard}
                  buyValue={$currentPlayer.getCardBuyValue(card)}
                  currentPlayerBalance={$currentPlayer.$resources.balance}
                />
                <button on:click|stopPropagation={handleSellCard}
                  >Sell (+${$currentPlayer.cardTradeValue})</button
                >
              {:else}
                <CardBuyButton
                  disabled
                  buyValue={$currentPlayer.getCardBuyValue(card)}
                  currentPlayerBalance={$currentPlayer.$resources.balance}
                />
                <button disabled
                  >Sell (+${$currentPlayer.cardTradeValue})</button
                >
              {/if}
            {/if}
            <button on:click|stopPropagation={cancelZoom}>Cancel</button>
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  .card {
    position: relative;
    z-index: 1;
    border: 5px solid #000;
    border-radius: 5px;
    margin: 1rem;
    overflow: hidden;

    width: 7.5rem;
    height: 10rem;

    cursor: pointer;
  }

  .card-zoom {
    transform: scale(2.5) translateY(var(--zoom-top));
    z-index: 3;
    cursor: auto;
  }

  .card-blocked {
    cursor: not-allowed;
  }

  .card-invisible {
    visibility: hidden;
    z-index: 0;
    width: 7.5rem;
  }

  .card-back,
  .card-front {
    width: 100%;
    height: 100%;
  }

  .card-age,
  .card-name {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    margin: 0;
    background: pink;
    white-space: nowrap;
    font-size: 0.6rem;
    font-weight: bold;
    padding: 0.3rem 0;
  }

  .card-actions {
    position: absolute;
    left: 0;
    bottom: 1.5rem;
    width: 100%;
    font-size: 0.4rem;
    display: flex;
    justify-content: space-around;
  }

  .card-type-raw {
    background-color: var(--raw-card-color);
  }

  .card-type-manufacture {
    background-color: var(--manufacture-card-color);
  }

  .card-type-civic {
    background-color: var(--civic-card-color);
  }

  .card-type-trade {
    background-color: var(--trade-card-color);
  }

  .card-type-military {
    background-color: var(--military-card-color);
  }

  .card-type-science {
    background-color: var(--science-card-color);
  }

  .card-type-guild {
    background-color: var(--guild-card-color);
  }

  .card-age-1 {
    background-color: var(--age-1-color);
  }

  .card-age-2 {
    background-color: var(--age-2-color);
  }

  .card-age-3 {
    background-color: var(--age-3-color);
  }

  .card-age-guild {
    background-color: var(--age-guild-color);
  }
</style>
