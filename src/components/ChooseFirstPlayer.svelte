<script>
  import { beforeUpdate } from 'svelte';

  import {
    isAgeInitSetupInProgress,
    currentPlayer,
    currentAgeName,
    playerOne,
    playerTwo,
    conflictPawnIndex
  } from '../stores';

  import { chooseFirstPlayer } from '../actions';

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
  console.log($conflictPawnIndex, selector);
</script>

<div class="overlay"
  style="
    --current-player-color: {selector.$color};
    --player-one-color: {$playerOne.$color};
    --player-two-color: {$playerTwo.$color};
  "
>
  <div class="choose-player">
    <h1><i class="player-name">{selector.$name}</i> choose the first player of <i>{$currentAgeName}</i>:</h1>
    <footer class="choose-buttons">
      <button class="player-one-button"
        on:click|once|stopPropagation={() => choose($playerOne)}
      >{$playerOne.$name}</button>
      <button class="player-two-button"
        on:click|once|stopPropagation={() => choose($playerTwo)}
      >{$playerTwo.$name}</button>
    </footer>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;

    background: rgba(0, 0, 0, .5);

    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .choose-player {
    box-sizing: border-box;
    background: white;
    border: 1rem solid var(--current-player-color);
    width: 50%;
    padding: 2rem 5rem;
    margin-top: -15rem;
  }

  .player-name {
    color: var(--current-player-color);
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
