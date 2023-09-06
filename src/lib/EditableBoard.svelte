<script>
  import { getSegmentForPoint, reduceCurvesToPath } from './boardfns';
  import Svg from './SVG.svelte';
  import { segments, startPos } from '../store.js';

  let hover;

  const handleClick = ({ detail: p }) => {
    const s = getSegmentForPoint(p, $segments.at(-1));
    if (!$segments.length) $startPos = s.guide.i;
    $segments = [...$segments, s];
    hover = undefined;
  };

  const handleHover = ({ detail: p }) => {
    hover = p;
  };

  $: track = {
    middle: reduceCurvesToPath($segments.map((e) => e.guide)),
    border: reduceCurvesToPath($segments.map((e) => e.inner))
      + reduceCurvesToPath($segments.map((e) => e.outer)),
  }

  $: hoverSeg = hover ? getSegmentForPoint(hover, $segments.at(-1)) : undefined;
  $: hoverTrack = hoverSeg ? {
    middle: reduceCurvesToPath([hoverSeg.guide]),
    border: reduceCurvesToPath([hoverSeg.inner])
      + reduceCurvesToPath([hoverSeg.outer])
  } : undefined;
</script>

<Svg
  on:mouseleave={() => { hover = false;}}
  on:mousemove={handleHover}
  on:mousedown={handleClick}
>
  {#if hoverTrack}
    <path class="guide" d={hoverTrack.middle} />
    <path class="theoreticalBorder" d={hoverTrack.border} />
  {/if}
  {#if $segments.length}
    <path class="guide" d={track.middle} />
    <path class="border" d={track.border} />
  {/if}
  {#each $segments as s}
    <circle cx={s.guide.i.x} cy={s.guide.i.y} r=1 class="guide"></circle>
    <circle cx={s.guide.f.x} cy={s.guide.f.y} r=1 class="guide"></circle>
  {/each}
  {#if hover}
    <circle cx={hover.x} cy={hover.y} r=1 class="guide"></circle>
  {/if}
  {#if $startPos}
    <circle cx={$startPos.x} cy={$startPos.y} r=2 class="startDot"></circle>
  {/if}
</Svg>

<style>
  circle.startDot {
    fill: var(--theme-ship);
  }
  circle.guide {
    fill: hsla(0, 0%, 50%);
  }
  path.guide {
    stroke: var(--theme-primary);
    stroke-width: 0.5;
    stroke-dasharray: 1 2;
    fill: none;
  }
  path.border {
    stroke: var(--theme-primary);
    fill: none;
  }
  path.theoreticalBorder {
    stroke: var(--theme-active);
    fill: none;
  }
</style>