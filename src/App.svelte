<script>
  // entry point for the Svelte app  
  import Boards from "./lib/Boards.svelte";
  import Buttons from './lib/Buttons.svelte';
  import { startPos } from './store.js';

  const tmp = (cmd) => console.log('todo:', cmd);

  // whenever the starting position changes, save it
  startPos.subscribe(() => tmp('window.mapsAPI.saveStart(start)'))
</script>

<main>
  <Boards />
  <Buttons />
</main>

<style>
main {
  max-width: 100vw;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
}
</style>
