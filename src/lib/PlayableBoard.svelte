<script>
  import { onMount, onDestroy } from 'svelte';
  import { reduceCurvesToPath } from './boardfns';
  import { segments } from '../store';

  // these will become references to the canvases
  let border;
  let stars;
  let ship;

  // const handleKeyUp = (e) => window.mapsAPI.keyUp(e.code);

  // const handleKeyDown = (e) => window.mapsAPI.keyDown(e.code);

  // hack to get css color variables in js
  const cssVar = (color) => getComputedStyle(border).getPropertyValue(color);

  const drawBorder = (d, ctx) => {
    const path = new Path2D(d);
    ctx.strokeStyle = cssVar('--theme-primary');
    ctx.stroke(path);
  };

  const drawStar = (x, y, r, ctx) => {
    const d = `
      M ${x + r},${y}
      Q ${x},${y} ${x},${y + r}
      Q ${x},${y} ${x - r},${y}
      Q ${x},${y} ${x},${y - r}
      Q ${x},${y} ${x + r},${y}
      `;
    const path = new Path2D(d);
    ctx.strokeStyle = cssVar('--theme-star');
    ctx.stroke(path);
  };

  const rand = (min, max) => Math.random() * (max - min) + min;

  onMount(() => {
    const drawStars = (ctx) => {
      for (let i = 0; i < 25; i++) {
        const [x, y, r] = [rand(0, 200), rand(0, 200), rand(1, 4)];
        drawStar(x, y, r, ctx);
      }
    };
    
    const d = reduceCurvesToPath($segments.map((s) => s.inner))
      + reduceCurvesToPath($segments.map((e) => e.outer));
  
    // draw the border
    const borderCtx = border.getContext('2d');
    const starsCtx = stars.getContext('2d');
  
    starsCtx.clearRect(0, 0, 200, 200);
    borderCtx.clearRect(0, 0, 200, 200);
  
    drawStars(starsCtx);
    drawBorder(d, borderCtx);
  
    // save the board and start the game
    const ret = border.toBlob(async (b) => {
      try {
        // await window.mapsAPI.saveMap(b);
        // window.mapsAPI.startEngine();
        // window.mapsAPI.startGame(ship);
  
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
      }
      catch (err) {
        console.log('Did not save/run:', err);
      }
      return 'hello';
    });
    console.log('ret', ret);
  });


  // cleanup function,
  // so that multiple listeners aren't created for the same event
  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown); // stop listening for key presses
    window.removeEventListener('keyup', handleKeyUp);
  })
</script>

<div>
  <canvas
    class="base"
    bind:this={border}
    width={200}
    height={200}
  />
  <canvas
    class="layer"
    bind:this={ship}
    width={200}
    height={200}
  />
  <canvas
    class="layer"
    bind:this={stars}
    width={200}
    height={200}
  />
</div>

<style>
  div {
    background: var(--theme-space);
    position: relative;
    width: 100%;
    height: 100%;
  }
  canvas {
    image-rendering: pixelated;
    width: 100%;
    height: 100%;
  }
  canvas.base {
    border: 1px solid var(--theme-primary);
  }
  canvas.layer {
    position: absolute;
    left: 0px;
    top: 0px;
  }
</style>