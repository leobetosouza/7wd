<script>
    export let player;
    export let points;
    export let winer = false;
    export let scientific = false;
    console.log(player)
    const { name, color } = player;
</script>

<section class="player-color-{$color} result-table {winer ? 'winer-table' : ''}">
    {#if winer}
        <h1 class="player-name">{$name} wins!</h1>
    {:else}
        <h1 class="player-name">{$name}</h1>
    {/if}
    {#if scientific}
        {#if winer}Science Supremacy{:else}&mdash;{/if}
    {:else}
        {points} VPs
    {/if}
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

    .player-name {
        font-size: 1.17rem;
    }

    .result-table {
        padding: 1.5rem;
    }

    .winer-table {
        font-size: 2rem;
    }

</style>