<script>
  import { createEventDispatcher } from "svelte";

  let svg; // used to access the svg DOM node

  const width = 200;
  const height = 200;

  // translate an event from css pixels to coordinates in the svg
  const toSVGCoords = (e) => {
    // not super happy using DOMrects, but the only other way to translate from
    // user coordinates to svg that I found
    // was to use createSVGpoint(), which is deprecated.
    const svgRect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - svgRect.x) / svgRect.width) * width,
      y: ((e.clientY - svgRect.y) / svgRect.height) * height,
    };
  };

  // translate the events to svg coords before sending them up the chain
  const dispatch = createEventDispatcher();
  const forward = (e) => {
    dispatch(e.type, toSVGCoords(e))
  }
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  id="board"
  viewBox="0 0 {width} {height}"
  on:mousedown={forward}
  on:mouseleave={forward}
  on:mousemove={forward}
  bind:this={svg}
>
  <slot />
</svg>

<style>
svg#board {
  background: var(--theme-space);
  border-style: solid;
  border-color: var(--theme-primary);
  border-width: 1px;
}
</style>