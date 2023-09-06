<script>
</script>

<button on:click {...$$props}>
  <slot />
</button>

<style>
  button {
    padding: 0.3rem 0.6rem;
    border-radius: 0.5rem;
    border-width: 3px;
    border-color: var(--theme-primary);
    border-style: solid;
    background: var(--theme-primary);
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
  button:hover {
    border-color: var(--theme-active);
    cursor: pointer;
  }
  button:disabled {
    border-color: var(--theme-primary);
    cursor: not-allowed;
  }
  button:active {
    border-color: var(--theme-space);
  }
</style>