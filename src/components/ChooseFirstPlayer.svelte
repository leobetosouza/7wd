<script>
  import {
    isAgeInitSetupInProgress,
    currentPlayer,
    currentAgeName,
    playerOne,
    playerTwo,
    conflictPawnIndex
  } from '../stores';

  import { chooseFirstPlayer } from '../actions';

  import Modal from './Modal.svelte';

  const choose = (player) => {
    chooseFirstPlayer(player);
    isAgeInitSetupInProgress.set(false);
  }

  let selector;

  if ($conflictPawnIndex === 9) {
    selector = $currentPlayer.getOpponentPlayer();
  } else if ($conflictPawnIndex > 9) {
    selector = $playerTwo;
  } else if ($conflictPawnIndex < 9) {
    selector = $playerOne;
  }
</script>

<Modal color={selector.$color}>
  <h1 style="
    --selector-color: {selector.$color};
  ">
    <i class="player-name">{selector.$name}</i>
    choose the first player of
    <i>{$currentAgeName}</i>:
  </h1>
  <footer class="choose-buttons">
    <button class="player-one-button"
      on:click|once|stopPropagation={() => choose($playerOne)}
    >{$playerOne.$name}</button>
    <button class="player-two-button"
      on:click|once|stopPropagation={() => choose($playerTwo)}
    >{$playerTwo.$name}</button>
  </footer>
</Modal>

<style>
  .player-name {
    color: var(--selector-color);
  }

  .choose-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .choose-buttons > button {
    font-size: 2rem;
  }

  .player-one-button {
    color: var(--player-one-color);
    border-color: var(--player-one-color);
  }

  .player-two-button {
    color: var(--player-two-color);
    border-color: var(--player-two-color);
  }
</style>
