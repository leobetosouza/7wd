<script>
  import { createEventDispatcher } from 'svelte';

  import Effect from '../Effect.svelte';

  export let progressToken;
  export let interable = false;

  const { effects } = progressToken;

  const dispatch = createEventDispatcher();

  const handleClick = () => {
    dispatch('select_token', { progressToken });
  };

</script>

<span class="progress-token" title={progressToken.name}
  class:progress-token-interable={interable}
>
  <span class="progress-token-effects">
    {#each Object.entries(effects) as [effect, value]}
      <Effect {effect} {value} />
    {/each}
  </span>
  {#if interable}
    <span>
      <span class="progress-token-name">{progressToken.name}</span>
      <button on:click|once|stopPropagation={handleClick}>Get it</button>
    </span>
  {/if}
</span>

<style>
  .progress-token {
    border: .3rem solid darkgreen;
    background-color: palegreen;
    font-size: 0.8rem;
    line-height: 3.2rem;
    width: 3.2rem;
    height: 3.2rem;
    text-align: center;
    vertical-align: middle;
    border-radius: 50%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .progress-token-effects {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .progress-token-interable {
    width: 8rem;
    height: 8rem;
    line-height: 1;
    justify-content: space-evenly;
  }

  .progress-token-name {
    display: block;
    font-size: .8rem;
    margin-bottom: .5rem;
  }
</style>
