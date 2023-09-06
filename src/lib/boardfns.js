// these functions are used in Board.js to define curves that
// are good and smooth

// this scales the distance of each bezier curve's control point (cp)
const flexibility = 0.7;
const radius = 7; // 1/2 the width of the track

const translatePointAlongSlope = (pt, rise, run, dist) => {
  if (run === 0) return {
    x: pt.x,
    y: pt.y + dist
  }
  const m = rise / run;
  const theta = Math.atan(m);
  return {
    x: pt.x + (dist * Math.cos(theta) * Math.sign(run)),
    y: pt.y + (dist * Math.sin(theta) * Math.sign(run)),
  };
};

// given the new end point and the previous curve's
// end point and control point,
// define where the new control point should be so that
// the end of one curve and the start of the next are tangent
const generateNextCP = (pt, prevPt, prevCP) => {
  const rise = prevPt.y - prevCP.y;
  const run = prevPt.x - prevCP.x;
  if (run === 0) return { x: (pt.x + prevPt.x) / 2, y: (pt.y + prevPt.y) / 2 };

  const dist = flexibility * Math.hypot(pt.y - prevPt.y, pt.x - prevPt.x);
  return translatePointAlongSlope(prevPt, rise, run, dist);
};

// basically a constructor (__init__ statement in python) for a
// Segment class, only without the class
const getSegmentForPoint = (p, prev) => {
  // base case: just make it a short, horizontal segment
  if (!prev) {
    return {
      guide: { // dotted line
        i: { ...p, x: p.x - (radius * 2) },
        f: p,
        cp: { ...p, x: p.x - radius },
      },
      inner: { // one side of boarder
        i: { x: p.x - (radius * 2), y: p.y + radius },
        f: { x: p.x, y: p.y + radius },
        cp: { x: p.x - radius, y: p.y + radius },
      },
      outer: { // other side of boarder
        i: { x: p.x - (radius * 2), y: p.y - radius },
        f: { x: p.x, y: p.y - radius },
        cp: { x: p.x - radius, y: p.y - radius },
      },
    };
  }

  const cp = generateNextCP(p, prev.guide.f, prev.guide.cp);

  const rise = -(p.x - cp.x);
  const run = p.y - cp.y;
  const outP = translatePointAlongSlope(p, rise, run, radius);
  const inP = translatePointAlongSlope(p, rise, run, -radius);

  return {
    guide: {
      i: prev.guide.f,
      f: p,
      cp,
    },
    outer: {
      i: prev.outer.f,
      f: outP,
      cp: generateNextCP(outP, prev.outer.f, prev.outer.cp),
    },
    inner: {
      i: prev.inner.f,
      f: inP,
      cp: generateNextCP(inP, prev.inner.f, prev.inner.cp),
    },
  };
};

// represent given curves as a string for use in places like
// <path d={path string} />
// and ctx.strokePath(path string)
const reduceCurvesToPath = (curves) => (
  curves.reduce((r, { i, f, cp }) => (
    `${r}
    M ${i.x},${i.y}
    Q ${cp.x},${cp.y} ${f.x},${f.y}\n`
  ), '')
);

export {
  getSegmentForPoint,
  reduceCurvesToPath,
};
