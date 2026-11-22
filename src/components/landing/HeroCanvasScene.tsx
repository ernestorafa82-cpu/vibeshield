'use client';

import React, { useEffect, useRef } from 'react';

export interface HeroCanvasSceneProps {
  mode: 'before' | 'after';
  mouseX: number;
  mouseY: number;
}

interface Vec2 {
  x: number;
  y: number;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface ExtrudedGlyph {
  id: string;
  centerX: number;
  points: readonly Vec2[];
  driftPhase: number;
  driftDir: number;
}

const HALF_DEPTH = 0.24;

function evalCubicBezier(
  p0: Vec2,
  p1: Vec2,
  p2: Vec2,
  p3: Vec2,
  t: number,
): Vec2 {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

function ensureClockwiseYDown(points: Vec2[]): Vec2[] {
  let area2 = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    area2 += a.x * b.y - b.x * a.y;
  }
  return area2 < 0 ? [...points].reverse() : points;
}

/**
 * Generates a smooth, constant-thickness architectural geometric "S" contour
 * by offsetting a 3-segment C1-continuous cubic Bezier spine.
 */
function buildGeometricSContour(): Vec2[] {
  const segments: readonly [Vec2, Vec2, Vec2, Vec2][] = [
    // Upper bowl (top-right terminal -> top crest -> upper-left inflection)
    [
      { x: 0.34, y: -0.44 },
      { x: 0.26, y: -0.66 },
      { x: -0.28, y: -0.66 },
      { x: -0.32, y: -0.34 },
    ],
    // Diagonal waist spine (upper-left -> optical center -> lower-right)
    [
      { x: -0.32, y: -0.34 },
      { x: -0.36, y: -0.04 },
      { x: 0.36, y: 0.04 },
      { x: 0.33, y: 0.34 },
    ],
    // Lower bowl (lower-right -> bottom crest -> bottom-left terminal)
    [
      { x: 0.33, y: 0.34 },
      { x: 0.29, y: 0.66 },
      { x: -0.27, y: 0.66 },
      { x: -0.35, y: 0.43 },
    ],
  ];

  const samplesPerSeg = 12;
  const spine: Vec2[] = [];
  for (let s = 0; s < segments.length; s++) {
    const [p0, p1, p2, p3] = segments[s];
    const startIdx = s === 0 ? 0 : 1;
    for (let i = startIdx; i <= samplesPerSeg; i++) {
      spine.push(evalCubicBezier(p0, p1, p2, p3, i / samplesPerSeg));
    }
  }

  const halfStroke = 0.125;
  const leftSide: Vec2[] = [];
  const rightSide: Vec2[] = [];

  for (let i = 0; i < spine.length; i++) {
    const prev = spine[Math.max(0, i - 1)];
    const next = spine[Math.min(spine.length - 1, i + 1)];
    const tx = next.x - prev.x;
    const ty = next.y - prev.y;
    const len = Math.hypot(tx, ty) || 1;
    const nx = -ty / len;
    const ny = tx / len;

    leftSide.push({
      x: spine[i].x + nx * halfStroke,
      y: spine[i].y + ny * halfStroke,
    });
    rightSide.push({
      x: spine[i].x - nx * halfStroke,
      y: spine[i].y - ny * halfStroke,
    });
  }

  return ensureClockwiseYDown([...leftSide, ...rightSide.reverse()]);
}

const VSH_GLYPHS: readonly ExtrudedGlyph[] = [
  {
    id: 'V',
    centerX: -1.24,
    driftPhase: 0.0,
    driftDir: -1,
    points: ensureClockwiseYDown([
      { x: -1.78, y: -0.72 },
      { x: -1.5, y: -0.72 },
      { x: -1.24, y: 0.26 },
      { x: -0.98, y: -0.72 },
      { x: -0.7, y: -0.72 },
      { x: -1.1, y: 0.72 },
      { x: -1.38, y: 0.72 },
    ]),
  },
  {
    id: 'S',
    centerX: 0.0,
    driftPhase: 2.1,
    driftDir: 1,
    points: buildGeometricSContour(),
  },
  {
    id: 'H',
    centerX: 1.24,
    driftPhase: 4.2,
    driftDir: -1,
    points: ensureClockwiseYDown([
      { x: 0.74, y: -0.72 },
      { x: 1.0, y: -0.72 },
      { x: 1.0, y: -0.13 },
      { x: 1.48, y: -0.13 },
      { x: 1.48, y: -0.72 },
      { x: 1.74, y: -0.72 },
      { x: 1.74, y: 0.72 },
      { x: 1.48, y: 0.72 },
      { x: 1.48, y: 0.09 },
      { x: 1.0, y: 0.09 },
      { x: 1.0, y: 0.72 },
      { x: 0.74, y: 0.72 },
    ]),
  },
];

function rotatePoint(p: Vec3, rotX: number, rotY: number, rotZ = 0): Vec3 {
  let x = p.x;
  let y = p.y;
  const z = p.z;

  if (rotZ !== 0) {
    const cosZ = Math.cos(rotZ);
    const sinZ = Math.sin(rotZ);
    const xz = x * cosZ - y * sinZ;
    const yz = x * sinZ + y * cosZ;
    x = xz;
    y = yz;
  }

  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = x * cosY - z * sinY;
  const z1 = x * sinY + z * cosY;

  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y2 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;

  return { x: x1, y: y2, z: z2 };
}

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

/**
 * Interactive 60fps HTML5 Canvas rendering a solid CNC-sculpted 3D extruded "VSH"
 * (VibeShield) monogram rotating smoothly in front of the fluted studio backdrop.
 * Reacts to pointer parallax and snaps between "Prototipo IA" (drifting alert)
 * and "Tras VibeShield" (aligned sapphire-obsidian & brushed silver-ice lock).
 */
export function HeroCanvasScene({
  mode,
  mouseX,
  mouseY,
}: HeroCanvasSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderOnceRef = useRef<(() => void) | null>(null);
  const stateRef = useRef({
    mode,
    targetMouseX: mouseX,
    targetMouseY: mouseY,
    currentMouseX: 0,
    currentMouseY: 0,
    instability: mode === 'after' ? 0 : 1,
  });

  useEffect(() => {
    stateRef.current.mode = mode;
    stateRef.current.targetMouseX = mouseX;
    stateRef.current.targetMouseY = mouseY;
    renderOnceRef.current?.();
  }, [mode, mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      return;
    }
    if (!ctx) {
      return;
    }

    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width, 320);
      height = Math.max(rect.height, 320);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderFrame(false);
    };

    // Match the upper-right diagonal fluted studio light in hero-backdrop.jpg
    const keyLight = normalize({ x: 0.45, y: -0.62, z: -0.64 });
    const rimLight = normalize({ x: -0.68, y: 0.32, z: -0.46 });
    const viewDir = { x: 0, y: 0, z: -1 };
    const halfVec = normalize({
      x: keyLight.x + viewDir.x,
      y: keyLight.y + viewDir.y,
      z: keyLight.z + viewDir.z,
    });

    let rafId = 0;
    let time = 0;

    const renderFrame = (advanceTime: boolean) => {
      if (!ctx) return;
      const s = stateRef.current;
      const isHardened = s.mode === 'after';

      if (reducedMotion) {
        s.currentMouseX = 0;
        s.currentMouseY = 0;
        s.instability = isHardened ? 0 : 1;
      } else {
        s.currentMouseX += (s.targetMouseX - s.currentMouseX) * 0.065;
        s.currentMouseY += (s.targetMouseY - s.currentMouseY) * 0.065;
        const targetInstability = isHardened ? 0 : 1;
        s.instability += (targetInstability - s.instability) * 0.08;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5 + s.currentMouseX * 16;
      const cy = height * 0.3 + s.currentMouseY * 9;
      const scale = Math.min(width * 0.088, height * 0.135, 118);

      // Subtle grounded shadow underneath the levitating 3D VSH emblem
      const shadowY = cy + scale * 1.14;
      const shadowGrad = ctx.createRadialGradient(
        cx,
        shadowY,
        4,
        cx,
        shadowY,
        scale * 2.15,
      );
      shadowGrad.addColorStop(
        0,
        isHardened ? 'rgba(6, 16, 36, 0.56)' : 'rgba(62, 14, 18, 0.52)',
      );
      shadowGrad.addColorStop(0.55, 'rgba(7, 20, 43, 0.24)');
      shadowGrad.addColorStop(1, 'rgba(7, 20, 43, 0)');
      ctx.save();
      ctx.translate(cx, shadowY);
      ctx.scale(1, 0.18);
      ctx.beginPath();
      ctx.arc(0, 0, scale * 2.15, 0, Math.PI * 2);
      ctx.fillStyle = shadowGrad;
      ctx.fill();
      ctx.restore();

      const baseRotY = reducedMotion
        ? -0.32
        : -0.32 + time * 0.36 + s.currentMouseX * 0.55;
      const baseRotX = reducedMotion
        ? 0.14
        : 0.13 + Math.sin(time * 0.52) * 0.045 + s.currentMouseY * 0.22;
      const fov = 6.2;

      const project = (world: Vec3) => {
        const perspective = fov / (fov + world.z);
        return {
          world,
          sx: cx + world.x * scale * perspective,
          sy: cy + world.y * scale * perspective,
          z: world.z,
        };
      };

      // Sort the 3 letters back-to-front by their rotated center depth
      const preparedGlyphs = VSH_GLYPHS.map((glyph) => {
        const driftY =
          s.instability *
          (reducedMotion
            ? glyph.driftDir * 0.08
            : Math.sin(time * 3.4 + glyph.driftPhase) * 0.09);
        const driftZ =
          s.instability *
          (reducedMotion
            ? glyph.driftDir * 0.12
            : Math.cos(time * 2.7 + glyph.driftPhase) * 0.14);
        const driftTiltZ =
          s.instability *
          (reducedMotion
            ? glyph.driftDir * 0.06
            : Math.sin(time * 4.1 + glyph.driftPhase) * 0.065);

        const transformLocal = (p: Vec3): Vec3 => {
          const centered: Vec3 = {
            x: p.x - glyph.centerX,
            y: p.y,
            z: p.z,
          };
          const tilted = rotatePoint(centered, 0, 0, driftTiltZ);
          const assembled: Vec3 = {
            x: tilted.x + glyph.centerX,
            y: tilted.y + driftY,
            z: tilted.z + driftZ,
          };
          return rotatePoint(assembled, baseRotX, baseRotY, 0);
        };

        const centerWorld = transformLocal({
          x: glyph.centerX,
          y: 0,
          z: 0,
        });

        // Front cap sits at -HALF_DEPTH (outward normal 0, 0, -1 toward camera)
        const frontNormal = normalize(
          rotatePoint(
            rotatePoint({ x: 0, y: 0, z: -1 }, 0, 0, driftTiltZ),
            baseRotX,
            baseRotY,
            0,
          ),
        );
        const frontVisible = frontNormal.z < 0;

        const frontPts = glyph.points.map((pt) =>
          project(transformLocal({ x: pt.x, y: pt.y, z: -HALF_DEPTH })),
        );
        const backPts = glyph.points.map((pt) =>
          project(transformLocal({ x: pt.x, y: pt.y, z: HALF_DEPTH })),
        );

        const sideQuads: {
          pts: ReturnType<typeof project>[];
          avgZ: number;
          diffuse: number;
          rim: number;
          spec: number;
        }[] = [];

        const n = glyph.points.length;
        for (let i = 0; i < n; i++) {
          const next = (i + 1) % n;
          const pA = glyph.points[i];
          const pB = glyph.points[next];
          const dx = pB.x - pA.x;
          const dy = pB.y - pA.y;
          // For CW polygon in Y-down space, outward 2D normal is (dy, -dx)
          const localNormal = normalize({ x: dy, y: -dx, z: 0 });
          const worldNormal = normalize(
            rotatePoint(
              rotatePoint(localNormal, 0, 0, driftTiltZ),
              baseRotX,
              baseRotY,
              0,
            ),
          );

          const quadPts = [
            frontPts[i],
            frontPts[next],
            backPts[next],
            backPts[i],
          ];
          const avgZ =
            (quadPts[0].z + quadPts[1].z + quadPts[2].z + quadPts[3].z) * 0.25;

          // Keep quads whose outward normal faces toward camera or grazing silhouette
          if (worldNormal.z < 0.18) {
            const diffuse = Math.max(0, dot(worldNormal, keyLight));
            const rim = Math.max(0, dot(worldNormal, rimLight));
            const spec = Math.pow(Math.max(0, dot(worldNormal, halfVec)), 16);
            sideQuads.push({ pts: quadPts, avgZ, diffuse, rim, spec });
          }
        }

        sideQuads.sort((a, b) => b.avgZ - a.avgZ);

        return {
          glyph,
          centerZ: centerWorld.z,
          frontVisible,
          frontNormal,
          frontPts,
          backPts,
          sideQuads,
        };
      }).sort((a, b) => b.centerZ - a.centerZ);

      for (const item of preparedGlyphs) {
        const alertMix = s.instability;

        // 1. Extruded brushed silver-ice metallic side bevels (back-to-front)
        for (const quad of item.sideQuads) {
          ctx.beginPath();
          ctx.moveTo(quad.pts[0].sx, quad.pts[0].sy);
          ctx.lineTo(quad.pts[1].sx, quad.pts[1].sy);
          ctx.lineTo(quad.pts[2].sx, quad.pts[2].sy);
          ctx.lineTo(quad.pts[3].sx, quad.pts[3].sy);
          ctx.closePath();

          const lit = quad.diffuse * 0.72 + quad.rim * 0.22 + quad.spec * 0.65;
          const clamped = Math.min(1, lit);

          // Cool brushed silver-ice titanium, shifting subtly toward crimson-slate in alert mode
          const rCool = Math.round(30 + clamped * 212);
          const gCool = Math.round(64 + clamped * 184);
          const bCool = Math.round(122 + clamped * 133);

          const rAlert = Math.round(115 + clamped * 135);
          const gAlert = Math.round(32 + clamped * 76);
          const bAlert = Math.round(42 + clamped * 68);

          const r = Math.round(rCool * (1 - alertMix) + rAlert * alertMix);
          const g = Math.round(gCool * (1 - alertMix) + gAlert * alertMix);
          const b = Math.round(bCool * (1 - alertMix) + bAlert * alertMix);

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${Math.min(255, r + 24)}, ${Math.min(255, g + 22)}, ${Math.min(255, b + 20)}, 0.42)`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }

        // 2. Visible primary sculpted face (sapphire-obsidian brushed glass)
        const capPts = item.frontVisible ? item.frontPts : item.backPts;
        const capNormal = item.frontVisible
          ? item.frontNormal
          : {
              x: -item.frontNormal.x,
              y: -item.frontNormal.y,
              z: -item.frontNormal.z,
            };

        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (const p of capPts) {
          if (p.sx < minX) minX = p.sx;
          if (p.sx > maxX) maxX = p.sx;
          if (p.sy < minY) minY = p.sy;
          if (p.sy > maxY) maxY = p.sy;
        }

        const capDiffuse = Math.max(0, dot(capNormal, keyLight));
        const capSpec = Math.pow(Math.max(0, dot(capNormal, halfVec)), 12);

        const faceGrad = ctx.createLinearGradient(minX, minY, maxX, maxY);
        if (alertMix < 0.5) {
          const midAlpha = Math.min(0.98, 0.92 + capDiffuse * 0.08);
          faceGrad.addColorStop(
            0,
            `rgba(${Math.round(12 + capDiffuse * 32)}, ${Math.round(31 + capDiffuse * 56)}, ${Math.round(66 + capDiffuse * 82)}, ${midAlpha})`,
          );
          faceGrad.addColorStop(
            0.46,
            `rgba(${Math.round(24 + capSpec * 120)}, ${Math.round(58 + capSpec * 125)}, ${Math.round(118 + capSpec * 115)}, 0.96)`,
          );
          faceGrad.addColorStop(1, 'rgba(7, 19, 41, 0.98)');
        } else {
          faceGrad.addColorStop(
            0,
            `rgba(${Math.round(88 + capDiffuse * 70)}, ${Math.round(20 + capDiffuse * 28)}, ${Math.round(28 + capDiffuse * 26)}, 0.96)`,
          );
          faceGrad.addColorStop(
            0.5,
            `rgba(${Math.round(132 + capSpec * 90)}, ${Math.round(34 + capSpec * 52)}, ${Math.round(38 + capSpec * 42)}, 0.95)`,
          );
          faceGrad.addColorStop(1, 'rgba(42, 11, 18, 0.98)');
        }

        ctx.beginPath();
        capPts.forEach((p, idx) => {
          if (idx === 0) ctx?.moveTo(p.sx, p.sy);
          else ctx?.lineTo(p.sx, p.sy);
        });
        ctx.closePath();

        ctx.save();
        ctx.shadowColor =
          alertMix < 0.5
            ? 'rgba(147, 197, 253, 0.28)'
            : 'rgba(248, 113, 113, 0.34)';
        ctx.shadowBlur = 14;
        ctx.fillStyle = faceGrad;
        ctx.fill();
        ctx.restore();

        // Razor-sharp machined silver-ice chamfer outline
        ctx.strokeStyle =
          alertMix < 0.5
            ? `rgba(226, 240, 255, ${(0.68 + capSpec * 0.3).toFixed(3)})`
            : `rgba(254, 202, 202, ${(0.66 + capSpec * 0.3).toFixed(3)})`;
        ctx.lineWidth = 1.35;
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      if (advanceTime && !reducedMotion) {
        time += 0.016;
        rafId = window.requestAnimationFrame(() => renderFrame(true));
      }
    };

    renderOnceRef.current = () => {
      if (reducedMotion) {
        renderFrame(false);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    if (!reducedMotion) {
      rafId = window.requestAnimationFrame(() => renderFrame(true));
    }

    return () => {
      renderOnceRef.current = null;
      window.removeEventListener('resize', resize);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 block h-full w-full"
    />
  );
}
