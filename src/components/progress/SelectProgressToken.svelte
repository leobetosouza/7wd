<script>
  import ProgressToken from './ProgressToken.svelte';
  import Modal from '../Modal.svelte';

  import { availableProgressTokens, isProgressTokenBeingSelected, currentPlayer } from '../../stores';
  import { selectProgressToken } from '../../actions';

  const getProgressToken = ({ detail }) => {
    const { progressToken } = detail;
    selectProgressToken(progressToken);
  };
</script>

{#if $isProgressTokenBeingSelected}
  <Modal color={$currentPlayer.$color}>
    <h1>
      <i class="player-name">{$currentPlayer.$name}</i>
      choose one progress token:
    </h1>
    <div class="select-progress-token">
      {#each $availableProgressTokens as progressToken}
        {#if progressToken}
          <ProgressToken on:select_token={getProgressToken} {progressToken} interable />
        {/if}
      {/each}
    </div>
    <!-- <button on:click={() => isProgressTokenBeingSelected.set(false)}>Select!</button> -->
  </Modal>
{/if}

<style>
  .select-progress-token {
    display: flex;
    justify-content: space-around;
  }

  .player-name {
    color: var(--current-player-color);
  }
</style>
