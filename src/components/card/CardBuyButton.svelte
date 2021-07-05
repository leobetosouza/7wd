<script>
    export let disabled = false;
    export let buyValue;
    export let currentPlayerBalance;
    export let onClick = () => {};
</script>

{#if buyValue <= currentPlayerBalance}
    {#if disabled}
        <button disabled>Buy (${buyValue})</button>
    {:else}
        <button on:click|stopPropagation={onClick}>Buy (-${buyValue})</button>
    {/if}
{:else}
    <button disabled class="btn-buy-negative">Buy (-${buyValue})</button>
{/if}							

<style>
    .btn-buy-negative {
        color: red;
    }
</style>