<script>
	import { onMount } from 'svelte';

    import { currentPlayer, playerOne, playerTwo } from '../../stores';
    import PlayerTable from './PlayerTable.svelte';

    let drawn;
    let winer;
    let loser;
    let winerPoints;
    let loserPoints;

    let playerOnePoints;
    let playerTwoPoints;

    onMount(() => {
        playerOnePoints = $playerOne.getEndGameVPs();
        playerTwoPoints = $playerTwo.getEndGameVPs();

        console.log(playerOnePoints, playerTwoPoints)

        if (playerOnePoints === playerTwoPoints) {
            drawn = true;
            console.log($playerOne, $playerTwo)
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
    });

</script>

<section class="endgame-table">
    {#if drawn != null}
        <PlayerTable player={winer} points={winerPoints} winer />
        <PlayerTable player={loser} points={loserPoints} loser />
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