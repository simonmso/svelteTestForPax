<script>
  import Button from "./Button.svelte";
  import { running, segments } from '../store';

  const tmp = (cmd) => console.log('todo:', cmd);
</script>

<div>
  {#if $running}
    <Button
      title="Stop testing and return to editing"
      on:click={() => { $running = false }}
    >stop ◼︎</Button>
    <Button
      title="Restart this test"
      on:click={() => tmp('window.mapsAPI.restart')}
    >restart ↩︎</Button>
  {:else}
    <Button
      disabled={!$segments.length}
      title={$segments.length ? 'test this map' : 'Click the map to add segments'}
    on:click={() => { $running = !!$segments.length }}
    >test ►</Button>
  {/if}
</div>

<style>
div {
  margin: 1rem;
  display: flex;
  gap: 1rem;
}
</style>