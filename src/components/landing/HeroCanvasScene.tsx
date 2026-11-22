'use client';

import React, { useEffect, useRef } from 'react';

export interface HeroCanvasSceneProps {
  mode: 'before' | 'after';
  mouseX: number;
  mouseY: number;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface FloatingMote {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  driftX: number;
  alpha: number;
  phase: number;
}

// Faceted architectural crystal-prism monolith
const VERTICES: readonly Vec3[] = [
  { x: 0, y: -1.48, z: 0 },
  { x: 0.82, y: -0.58, z: 0.48 },
  { x: 0, y: -0.58, z: 0.95 },
  { x: -0.82, y: -0.58, z: 0.48 },
  { x: -0.82, y: -0.58, z: -0.48 },
  { x: 0, y: -0.58, z: -0.95 },
  { x: 0.82, y: -0.58, z: -0.48 },
  { x: 0.92, y: 0.56, z: 0.54 },
  { x: 0, y: 0.56, z: 1.06 },
  { x: -0.92, y: 0.56, z: 0.54 },
  { x: -0.92, y: 0.56, z: -0.54 },
  { x: 0, y: 0.56, z: -1.06 },
  { x: 0.92, y: 0.56, z: -0.54 },
  { x: 0, y: 1.38, z: 0 },
];

const FACES: readonly (readonly number[])[] = [
  [0, 1, 2],
  [0, 2, 3],
  [0, 3, 4],
  [0, 4, 5],
  [0, 5, 6],
  [0, 6, 1],
  [1, 7, 8, 2],
  [2, 8, 9, 3],
  [3, 9, 10, 4],
  [4, 10, 11, 5],
  [5, 11, 12, 6],
  [6, 12, 7, 1],
  [13, 8, 7],
  [13, 9, 8],
  [13, 10, 9],
  [13, 11, 10],
  [13, 12, 11],
  [13, 7, 12],
];

function rotatePoint(p: Vec3, rotX: number, rotY: number): Vec3 {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = p.x * cosY - p.z * sinY;
  const z1 = p.x * sinY + p.z * cosY;

  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y2 = p.y * cosX - z1 * sinX;
  const z2 = p.y * sinX + z1 * cosX;

  return { x: x1, y: y2, z: z2 };
}

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

/**
 * Interactive 60fps HTML5 Canvas rendering a shaded translucent glacier-blue & porcelain
 * 3D architectural crystal monolith with volumetric light and smooth pointer inertia.
 */
export function HeroCanvasScene({
  mode,
  mouseX,
  mouseY,
}: HeroCanvasSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    mode,
    targetMouseX: mouseX,
    targetMouseY: mouseY,
    currentMouseX: 0,
    currentMouseY: 0,
  });

  useEffect(() => {
    stateRef.current.mode = mode;
    stateRef.current.targetMouseX = mouseX;
    stateRef.current.targetMouseY = mouseY;
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

    const motes: FloatingMote[] = Array.from({ length: 42 }, (_, i) => ({
      x: ((i * 73 + 17) % 100) / 100,
      y: ((i * 41 + 9) % 100) / 100,
      radius: 0.9 + (i % 3) * 0.6,
      speedY: 0.00014 + (i % 5) * 0.000045,
      driftX: ((i % 7) - 3) * 0.00003,
      alpha: 0.12 + (i % 4) * 0.08,
      phase: i * 0.8,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width, 320);
      height = Math.max(rect.height, 320);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const keyLight = normalize({ x: -0.45, y: -0.62, z: -0.65 });
    let rafId = 0;
    let time = 0;

    const renderFrame = () => {
      if (!ctx) return;
      const s = stateRef.current;
      const isHardened = s.mode === 'after';

      s.currentMouseX += (s.targetMouseX - s.currentMouseX) * 0.06;
      s.currentMouseY += (s.targetMouseY - s.currentMouseY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5 + s.currentMouseX * 18;
      const cy = height * 0.34 + s.currentMouseY * 10;
      const scale = Math.min(width * 0.125, height * 0.145, 138);

      // Cool studio ice-blue volumetric aura
      const aura = ctx.createRadialGradient(
        cx,
        cy,
        scale * 0.15,
        cx,
        cy,
        scale * 3.1,
      );
      if (isHardened) {
        aura.addColorStop(0, 'rgba(191, 219, 254, 0.32)');
        aura.addColorStop(0.35, 'rgba(59, 130, 246, 0.22)');
        aura.addColorStop(0.68, 'rgba(26, 59, 117, 0.16)');
        aura.addColorStop(1, 'rgba(11, 28, 56, 0)');
      } else {
        aura.addColorStop(0, 'rgba(248, 113, 113, 0.30)');
        aura.addColorStop(0.4, 'rgba(153, 27, 27, 0.20)');
        aura.addColorStop(1, 'rgba(11, 28, 56, 0)');
      }
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      // Soft volumetric studio sweep
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.46);
      const beam = ctx.createLinearGradient(-width * 0.45, 0, width * 0.45, 0);
      beam.addColorStop(0, 'rgba(255,255,255,0)');
      beam.addColorStop(
        0.5,
        isHardened
          ? 'rgba(238, 245, 255, 0.06)'
          : 'rgba(248, 113, 113, 0.05)',
      );
      beam.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = beam;
      ctx.fillRect(-width, -scale * 0.75, width * 2, scale * 1.5);
      ctx.restore();

      // Subtle rising frost motes
      for (const m of motes) {
        if (!reducedMotion) {
          m.y -= m.speedY;
          m.x += m.driftX + Math.sin(time * 0.7 + m.phase) * 0.00006;
          if (m.y < -0.04) m.y = 1.04;
          if (m.x < -0.04) m.x = 1.04;
          if (m.x > 1.04) m.x = -0.04;
        }
        ctx.beginPath();
        ctx.arc(m.x * width, m.y * height, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = isHardened
          ? `rgba(219, 234, 254, ${m.alpha})`
          : `rgba(252, 165, 165, ${m.alpha})`;
        ctx.fill();
      }

      // Soft studio pedestal shadow
      const pedestalY = cy + scale * 1.55;
      const floorShadow = ctx.createRadialGradient(
        cx,
        pedestalY,
        4,
        cx,
        pedestalY,
        scale * 1.5,
      );
      floorShadow.addColorStop(
        0,
        isHardened
          ? 'rgba(147, 197, 253, 0.26)'
          : 'rgba(201, 74, 34, 0.24)',
      );
      floorShadow.addColorStop(0.55, 'rgba(7, 18, 38, 0.55)');
      floorShadow.addColorStop(1, 'rgba(7, 18, 38, 0)');
      ctx.save();
      ctx.translate(cx, pedestalY);
      ctx.scale(1, 0.24);
      ctx.beginPath();
      ctx.arc(0, 0, scale * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = floorShadow;
      ctx.fill();
      ctx.restore();

      // Orbital precision rings
      const ringConfigs = [
        { r: 1.52, tilt: 0.34, speed: 0.14, dashed: false },
        { r: 2.02, tilt: 0.28, speed: -0.09, dashed: true },
      ];
      for (const cfg of ringConfigs) {
        ctx.save();
        ctx.translate(cx, cy + scale * 0.12);
        ctx.rotate(s.currentMouseX * 0.14 + Math.sin(time * 0.2) * 0.05);
        ctx.scale(1, cfg.tilt);
        ctx.beginPath();
        ctx.arc(0, 0, scale * cfg.r, 0, Math.PI * 2);
        ctx.strokeStyle = isHardened
          ? 'rgba(191, 219, 254, 0.28)'
          : 'rgba(248, 113, 113, 0.34)';
        ctx.lineWidth = cfg.dashed ? 0.9 : 1.25;
        if (cfg.dashed) ctx.setLineDash([4, 9]);
        ctx.stroke();

        const dotAngle = time * cfg.speed * 4 + (cfg.dashed ? 2.4 : 0.4);
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(
          Math.cos(dotAngle) * scale * cfg.r,
          Math.sin(dotAngle) * scale * cfg.r,
          3.2,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = isHardened ? '#DBEAFE' : '#FCA5A5';
        ctx.fill();
        ctx.restore();
      }

      // 3D Glass & Glacier-Blue Crystal Projection
      const rotY = time * 0.26 + s.currentMouseX * 0.6;
      const rotX = 0.22 + Math.sin(time * 0.38) * 0.06 + s.currentMouseY * 0.28;
      const fov = 4.6;

      const transformed = VERTICES.map((v, idx) => {
        const fracture =
          !isHardened && !reducedMotion
            ? Math.sin(time * 6.5 + idx * 1.7) * 0.045
            : 0;
        const r = rotatePoint(
          { x: v.x + fracture, y: v.y, z: v.z - fracture },
          rotX,
          rotY,
        );
        const perspective = fov / (fov + r.z);
        return {
          world: r,
          sx: cx + r.x * scale * perspective,
          sy: cy + r.y * scale * perspective,
          z: r.z,
        };
      });

      const faceList = FACES.map((indices) => {
        const pts = indices.map((i) => transformed[i]);
        const avgZ = pts.reduce((acc, p) => acc + p.z, 0) / pts.length;

        const a = pts[0].world;
        const b = pts[1].world;
        const c = pts[2].world;
        const u = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
        const v = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
        const normal = normalize({
          x: u.y * v.z - u.z * v.y,
          y: u.z * v.x - u.x * v.z,
          z: u.x * v.y - u.y * v.x,
        });

        const lightDot = Math.max(
          0,
          normal.x * keyLight.x +
            normal.y * keyLight.y +
            normal.z * keyLight.z,
        );

        return { pts, avgZ, lightDot };
      }).sort((f1, f2) => f2.avgZ - f1.avgZ);

      for (const face of faceList) {
        ctx.beginPath();
        face.pts.forEach((p, idx) => {
          if (idx === 0) ctx?.moveTo(p.sx, p.sy);
          else ctx?.lineTo(p.sx, p.sy);
        });
        ctx.closePath();

        if (isHardened) {
          // Physical frosted glacier-blue / sapphire architectural glass
          const r = Math.round(32 + face.lightDot * 195);
          const g = Math.round(78 + face.lightDot * 165);
          const b = Math.round(148 + face.lightDot * 107);
          const alpha = 0.24 + face.lightDot * 0.44;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
          ctx.strokeStyle = `rgba(219, 234, 254, ${(0.28 + face.lightDot * 0.55).toFixed(3)})`;
        } else {
          const r = Math.round(92 + face.lightDot * 135);
          const g = Math.round(24 + face.lightDot * 54);
          const b = Math.round(28 + face.lightDot * 38);
          const alpha = 0.22 + face.lightDot * 0.38;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
          ctx.strokeStyle = `rgba(248, 113, 113, ${(0.3 + face.lightDot * 0.5).toFixed(3)})`;
        }
        ctx.fill();
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      if (!reducedMotion) {
        time += 0.016;
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
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
