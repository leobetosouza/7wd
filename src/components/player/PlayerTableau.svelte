<script>
    import CardPresenter from "../card/Card.svelte";

    export let player;

</script>

<section class="player-tableau player-color-{player.color}">
    <h1>{player.name}</h1>
    <p>
        Coins: {player.coins}
    </p>
    <!-- {#each cards as card}
        <CardPresenter {card} />
    {/each} -->
</section>

<style>
    .player-color-red {
		background: red;
	}
    .player-color-blue {
		background: blue;
	}
</style>