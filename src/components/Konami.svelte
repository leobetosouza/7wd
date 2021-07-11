<script>
  let konami = false;
  const raw =
    '\xe2\x9d\xa4\xef\xb8\x8f\xe2\x9c\xa8\xf0\x9f\x94\xa5\x46\x4f\x52\x41\x20\x42\x4f\x4c\x53\x4f\x4e\x41\x52\x4f\x20\x47\x45\x4e\x4f\x43\x49\x44\x41\x21\xf0\x9f\x94\xa5\xe2\x9c\xa8\xe2\x9d\xa4\xef\xb8\x8f';
  const msg = decodeURIComponent(escape(raw));

  let combo = [];
  let time = Date.now();

  function combinator({ keyCode }) {
    const list = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    const now = Date.now();

    if (!list.includes(keyCode)) return;
    if (now - time > 2000) combo = [];

    combo.push(keyCode);
    time = now;

    if (JSON.stringify(combo) === JSON.stringify(list)) {
      konami = !konami;
    }
  }
</script>

<svelte:window on:keyup={combinator} />

{#if konami}
  <marquee class="konami-msg">{msg}</marquee>
{/if}

<style>
  .konami-msg {
    color: aqua;
    background: deeppink;
    font-size: 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5em;
    position: relative;
    top: 10;
  }
</style>
