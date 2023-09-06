<script>
  import { running } from "../store";
  import EditableBoard from "./EditableBoard.svelte";
  import PlayableBoard from "./PlayableBoard.svelte";
</script>

{#if $running}
  <PlayableBoard />
{:else}
  <EditableBoard />
{/if}

