<script>
  import ProgressToken from './ProgressToken.svelte';

  import { availableProgressTokens } from '../../stores';

  import SelectProgressToken from './SelectProgressToken.svelte';
</script>

<SelectProgressToken />
<section class="progress-board">
  {#each $availableProgressTokens as progressToken}
    {#if progressToken}
      <ProgressToken {progressToken} />
    {:else}
      <span />
    {/if}
  {/each}
</section>

<style>
  .progress-board {
    grid-area: progress;
    background: lawngreen;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
</style>
