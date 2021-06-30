<script>
    import CardPresenter from "../card/CardPresenter.svelte";

    import { currentPlayer } from '../../stores';

    export let player;

    const { tableau, color, coins, vps, name, shields, stone, wood, clay, papyrus, glass, differentSciences } = player;
</script>

<section class="player-tableau player-color-{$color} {player === $currentPlayer ? 'player-tableau-active' : '' }">
    <h1>{$name}</h1>
    <p style="background: whitesmoke">
        Cards: {$tableau.length}
        <br />
        Coins: {$coins} | Shields: {$shields} | VPs: {$vps}
        <br />
        Stone: {$stone} | Wood: {$wood} | Clay: {$clay}
        <br />
        Glass: {$glass} | Papyrus: {$papyrus}
        <br >
        Different Sciences: {$differentSciences}
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