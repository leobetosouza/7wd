<script>
  export let color;
</script>

<div class="overlay"
  style="
    --color: {color};
  "
>
  <div class="content">
    <slot></slot>
  </div>
</div>
<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;

    background: rgba(0, 0, 0, .5);

    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .content {
    box-sizing: border-box;
    background: white;
    border: 1rem solid var(--color);
    width: 50%;
    padding: 2rem 5rem;
    margin-top: -15rem;
  }
</style>
