<script>
  import { onMount } from 'svelte';

  import {
    currentPlayer,
    playerOne,
    playerTwo,
    scientificSupremacist,
  } from '../../stores';
  import PlayerTable from './PlayerTable.svelte';

  let drawn;
  let winer;
  let loser;
  let winerPoints;
  let loserPoints;

  let playerOnePoints;
  let playerTwoPoints;

  console.log('foooooo');

  if ($scientificSupremacist) {
    loser = $scientificSupremacist === $playerTwo ? $playerOne : $playerTwo;

    console.log($scientificSupremacist, loser);
  } else {
    playerOnePoints = $playerOne.getEndGameVPs();
    playerTwoPoints = $playerTwo.getEndGameVPs();

    console.log(playerOnePoints, playerTwoPoints);

    if (playerOnePoints === playerTwoPoints) {
      drawn = true;
      console.log($playerOne, $playerTwo);
    } else if (playerOnePoints > playerTwoPoints) {
      drawn = false;
      winer = $playerOne;
      loser = $playerTwo;
      winerPoints = playerOnePoints;
      loserPoints = playerTwoPoints;

      currentPlayer.set(playerOne);
    } else {
      drawn = false;
      winer = $playerTwo;
      loser = $playerOne;
      winerPoints = playerTwoPoints;
      loserPoints = playerOnePoints;

      currentPlayer.set(playerTwo);
    }
  }
</script>

<section class="endgame-table">
  {#if $scientificSupremacist}
    <PlayerTable player={$scientificSupremacist} scientific winer />
    <PlayerTable player={loser} scientific />
  {:else if drawn != null}
    <PlayerTable player={winer} points={winerPoints} winer />
    <PlayerTable player={loser} points={loserPoints} />
  {:else if drawn}
    <PlayerTable player={$playerOne} points={playerOnePoints} />
    <PlayerTable player={$playerTwo} points={playerTwoPoints} />
  {/if}
</section>

<style>
  .endgame-table {
    grid-area: maintable;
    display: flex;
    flex-flow: column;
  }
</style>
