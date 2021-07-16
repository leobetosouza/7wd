<script>
  import { beforeUpdate, onMount } from 'svelte';

  import PlayerTableau from './components/player/PlayerTableau.svelte';
  import MainTable from './components/table/MainTable.svelte';
  import EndGameTable from './components/endgame/EndGameTable.svelte';
  import MilitaryBoard from './components/military/MilitaryBoard.svelte';
  import Konami from './components/Konami.svelte';
  import ChooseFirstPlayer from './components/ChooseFirstPlayer.svelte';

  import {
    currentPlayer,
    agePromise,
    currentAgeName,
    playerOne,
    playerTwo,
    reserve,
    discard,
    hasGameEnded,
    isAgeInitSetupInProgress
  } from './stores';

  import { createPlayers, setupNextAge } from './actions';

  let isGameStarted = false;

  const startGame = async () => {
    await setupNextAge();

    isGameStarted = true;
  };

  onMount(() => {
    createPlayers(
      { name: 'Player 1', color: 'red' },
      { name: 'Player 2', color: 'blue' }
    );

    startGame();
  });

  beforeUpdate(() => {
    if ($hasGameEnded) {
      console.log('FIM DO JOGO');
    }
  });
</script>

<main
  style="
    --player-one-color: {$playerOne.$color};
    --player-two-color: {$playerTwo.$color};
    --current-player-color: {$currentPlayer.$color};
  "
>
  {#if $isAgeInitSetupInProgress}
    <ChooseFirstPlayer />
  {/if}

  {#if !isGameStarted}
    <button on:click|once={startGame}>Start Game</button>
  {/if}

  {#if isGameStarted && $agePromise}
    {#await $agePromise}
      <p>waiting cards...</p>
    {:then}
      <section class="gametable"
        class:gametable-neutral={$isAgeInitSetupInProgress}
      >
        <header class="header">
          <h1 style="margin: 0">
            {@html $hasGameEnded ? 'GAME&apos;s END' : $currentAgeName}
          </h1>
          Reserve: {$reserve.length} | Discard: {$discard.length}
          <Konami />
        </header>
        <PlayerTableau player={$playerOne} gridArea="player1" />
        <PlayerTableau player={$playerTwo} gridArea="player2" />
        <MilitaryBoard />
        {#if $hasGameEnded}
          <EndGameTable />
        {:else}
          <MainTable />
        {/if}
      </section>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  {/if}
</main>

<style>
  :global(:root) {
    --raw-card-color: brown;
    --wonder-card-color: #000;
    --manufacture-card-color: gray;
    --civic-card-color: blue;
    --trade-card-color: yellow;
    --military-card-color: crimson;
    --science-card-color: green;
    --guild-card-color: purple;

    --age-1-color: saddlebrown;
    --age-2-color: royalblue;
    --age-3-color: blueviolet;
    --age-guild-color: violet;

    --vps-color: blue;
    --coins-color: goldenrod;
    --glass-color: dodgerblue;
    --papyrus-color: khaki;
    --stone-color: silver;
    --clay-color: sandybrown;
    --wood-color: sienna;
    --shields-color: red;
    --science-color: lime;
    --stock-color: goldenrod;
  }

  main {
    text-align: center;
    padding: 0;
    margin: 0 auto;
    height: 100%;
    overflow: hidden;
  }

  .gametable {
    background: var(--current-player-color);
    display: grid;
    overflow: hidden;

    grid-template-areas: 'header  header    header'
                         'player1 military  player2'
                         'player1 maintable player2';
    grid-template-columns: 15% auto 15%;
    grid-template-rows: 5rem 2.8rem auto;

    justify-content: stretch;

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .gametable-neutral {
    background-color: gray;
  }

  .header {
    grid-area: header;
    background: #fff;
    text-align: center;
    padding: 8px 0;
  }

  @media (min-width: 640px) {
  }
</style>
