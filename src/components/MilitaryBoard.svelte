<script>
    import { militaryLayout } from '../stores';
    import Effect from './Effect.svelte';
</script>

<div class="military-board">
    {#each $militaryLayout as slot }
        <div class="military-slot">
            {#if slot.victory}
                WIN
            {/if}
            {#if slot.vp}
                <Effect isMini effect="vp" value={slot.vp} />
            {/if}
            {#if slot.debit}
                <Effect isMini effect="debit" value={slot.debit} />
            {/if}

        </div>
    {/each}
</div>

<style>
    .military-board {
        grid-area: military;
        background: crimson;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .military-slot {
        background: lightcoral;
        width: 3rem;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .slot-footer {
        background: magenta;
    }
</style>