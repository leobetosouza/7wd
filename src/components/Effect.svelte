<script>
    export let effect;
    export let value;
    export let isMini = false;
    export let isCost = false;
</script>

{#if ['wood', 'clay', 'stone', 'glass', 'papyrus', 'shields'].includes(effect)}
    {#each Array(value) as _ }
        <spam class="resource-empty resource-{effect} {isCost ? 'resource-cost' : ''}" title="{effect}"></spam>
    {/each}
{/if}
{#if ["vp", "coins"].includes(effect)}
    <spam class="resource-number resource-{effect} {isCost ? 'resource-cost' : ''} {isMini ? 'resource-mini' : ''}" title="{value} { effect === 'vp'  ? 'victory points' : effect}">{value}</spam>
{/if}
{#if effect === "science"}
    <spam class="resource-empty resource-science resource-science-{value}" title="science symbol {value}"></spam>
{/if}
{#if effect === "stock"}
    {#if Array.isArray(value)}
        {#each value as v}
            <svelte:self effect="stock" value={v} />
        {/each}
    {:else}
        <spam class="resource-empty resource-stock resource-{value}"  title="Stock of {value}"></spam>
    {/if}
{/if}
{#if effect === "or"}
    {#each Object.entries(value) as [e, v], i}
        {#if i}/{/if}<svelte:self effect={e} value={v} />
    {/each}
{/if}
{#if effect === "chain"}
    <spam class="resource-chain resource-chain-{value} {isCost ? 'resource-cost' : 'resource-chain-top'}" title="chain symbol {value}"></spam>
{/if}
{#if effect === "foreach-card"}
    <spam class="card-mini card-mini-{value.type}">
        {#each Object.entries(value.reward) as [e, v]}
            <svelte:self effect={e} value={v} isMini={true} />
        {/each}
    </spam>
{/if}

<style>
    .resource-chain {
        background: #fff;
        height: 1.2em;
        width: 1.2em;
        border: 2px solid #000;
    }
    .resource-chain-top {
        position: absolute;
        top: 0;
        right: 0;
        border-top: 0;
        border-right: 0;
    }

    .resource-empty {
        width: 1.1em;
        height: 1.1em;
        border: 2px solid #000;
    }

    .resource-number {
        padding: .3em .5em;
        border: 2px solid #000;
        font-size: .8em;
        line-height: 1;
        vertical-align: middle;
        border-radius: 50%;
    }

    .resource-stock {
        position: relative;
    }
    .resource-stock::before {
        content: '1';
        background: goldenrod;

        position: absolute;
        top: -0.9em;
        left: 0.8em;

        transform: scale(.7);
        
        padding: .3em .5em;
        border: 2px solid #000;
        font-size: .8em;
        line-height: 1;
        vertical-align: middle;
        border-radius: 50%;
    }

    .resource-science {
        background: lime;
    }

    .resource-vp {
        background: blue;
        color: #fff;
    }

    .resource-coins {
        background: goldenrod;
        color: #000;
    }

    .resource-glass {
        background: dodgerblue;
    }

    .resource-papyrus {
        background: khaki;
    }

    .resource-stone {
        background: silver;
    }

    .resource-clay {
        background: sandybrown;
    }

    .resource-wood {
        background: sienna;
    }

    .resource-shields {
        background: red;
    }

    .card-mini {
        width: 1em;
        height: 1.2em;
        border: 1px solid #666;
        border-radius: 3px;
        position: relative;
    }

    .resource-mini {
        transform: scale(.7);
        position: absolute;
        bottom: -1.1em;
    }

    .resource-mini.resource-coins {
        left: -1em;
    }
    .resource-mini.resource-vp {
        right: -1em;
    }


    .card-mini-raw {
		background-color: brown;
	}

    .card-mini-wonder {
        background-color: #000;
    }

	.card-mini-manufacture {
		background-color: gray;
	}

	.card-mini-civic {
		background-color: blue;
	}

	.card-mini-trade {
		background-color: yellow;
	}

	.card-mini-military {
		background-color: crimson;
	}

	.card-mini-science {
		background-color: green;
	}

    .resource-cost {
        margin-left: .1em;
        transform: scale(.8);
    }
</style>