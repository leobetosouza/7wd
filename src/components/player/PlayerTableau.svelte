<script>
    import CardPresenter from "../card/CardPresenter.svelte";

    export let player;
    export let active;
    const { color, coins, vps, name, shields, tableau } = player;

</script>

<section class="player-tableau player-color-{$color} {active ? 'player-tableau-active' : '' }">
    <h1>{$name}</h1>
    <p>
        Coins: {$coins} | Shields: {$shields} | VPs: {$vps} | Cards: {$tableau.length}
    </p>
    <div class="card-stack">
    {#each $tableau as card, i}
        <div class="card-wraper" style="--top:-{10 * i}rem">
            <CardPresenter {card} />
        </div>
    {/each}
    </div>
</section>

<style>
    .player-color-red {
		background: red;
        border: 5px solid red;
	}
    .player-color-blue {
		background: blue;
        border: 5px solid blue;
	}
    .player-tableau-active {
        border-color: lightgreen;
    }

    .card-stack {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .card-wraper {
        position: relative;
        top: var(--top);
        z-index: 1;
    }
</style>