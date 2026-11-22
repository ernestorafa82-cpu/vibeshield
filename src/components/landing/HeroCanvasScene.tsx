'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  VSH_FOUNDRY_GLYPHS,
  type GlyphContourSpec,
} from '@/components/landing/vsh-glyph-paths';

export interface HeroCanvasSceneProps {
  mode: 'before' | 'after';
  mouseX: number;
  mouseY: number;
}

/**
 * Converts TrueType quadratic Bezier contour points ([x, y, onCurve]) into a
 * lossless THREE.Shape ready for smooth beveled 3D extrusion.
 */
function buildShapeFromTrueType(
  pts: readonly (readonly [number, number, 0 | 1])[],
): THREE.Shape {
  const shape = new THREE.Shape();
  const n = pts.length;
  if (n < 3) return shape;

  let startX: number;
  let startY: number;
  let startIdx: number;

  if (pts[0][2] === 1) {
    startX = pts[0][0];
    startY = pts[0][1];
    startIdx = 1;
  } else if (pts[n - 1][2] === 1) {
    startX = pts[n - 1][0];
    startY = pts[n - 1][1];
    startIdx = 0;
  } else {
    startX = (pts[n - 1][0] + pts[0][0]) * 0.5;
    startY = (pts[n - 1][1] + pts[0][1]) * 0.5;
    startIdx = 0;
  }

  shape.moveTo(startX, startY);

  let i = startIdx;
  const endLimit = startIdx === 1 ? n + 1 : n;

  while (i < endLimit) {
    const curr = pts[i % n];
    if (curr[2] === 1) {
      shape.lineTo(curr[0], curr[1]);
      i += 1;
    } else {
      const next = pts[(i + 1) % n];
      if (next[2] === 1) {
        shape.quadraticCurveTo(curr[0], curr[1], next[0], next[1]);
        i += 2;
      } else {
        const midX = (curr[0] + next[0]) * 0.5;
        const midY = (curr[1] + next[1]) * 0.5;
        shape.quadraticCurveTo(curr[0], curr[1], midX, midY);
        i += 1;
      }
    }
  }

  shape.closePath();
  return shape;
}

/**
 * Builds a high-contrast luxury watch/jewelry studio reflection dome (PMREM)
 * with bright diagonal front-hemisphere softbox bands + deep sapphire dark cards,
 * giving both the flat serif faces and curved bevels authentic liquid metallic-glass reflections.
 */
function buildStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color('#061126');

  const disposables: { dispose: () => void }[] = [];

  const addSoftbox = (
    w: number,
    h: number,
    colorHex: string,
    intensity: number,
    pos: [number, number, number],
    rotZ = 0,
  ) => {
    const geo = new THREE.PlaneGeometry(w, h);
    const col = new THREE.Color(colorHex).multiplyScalar(intensity);
    const mat = new THREE.MeshBasicMaterial({
      color: col,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos[0], pos[1], pos[2]);
    mesh.lookAt(0, 0, 0);
    if (rotZ !== 0) {
      mesh.rotateZ(rotZ);
    }
    envScene.add(mesh);
    disposables.push(geo, mat);
  };

  // FRONT-HEMISPHERE diagonal reflection strips (what the flat VSH glass faces reflect directly!)
  addSoftbox(14, 2.2, '#ffffff', 3.4, [1.8, 3.2, 8.2], -0.42);
  addSoftbox(12, 1.3, '#bfdbfe', 2.4, [-2.4, -0.6, 8.4], -0.42);
  addSoftbox(10, 1.1, '#93c5fd', 2.0, [3.2, -3.4, 7.8], -0.42);

  // Dark contrast card right between the front strips for razor-sharp chrome reflection bands
  addSoftbox(15, 1.5, '#07142b', 0.35, [0.0, 0.9, 7.6], -0.42);

  // Side & overhead platinum rim softboxes for gleaming 3D curved bevels
  addSoftbox(2.4, 11.0, '#eef5ff', 3.6, [7.6, 1.0, 2.5]);
  addSoftbox(2.8, 10.5, '#93c5fd', 2.9, [-7.4, 2.0, 1.6]);
  addSoftbox(11.0, 2.6, '#ffffff', 3.2, [0, 7.4, 1.8]);
  addSoftbox(11.5, 3.4, '#3b82f6', 1.8, [0, -6.8, 3.0]);

  // Rear reflection strips (visible when VSH spins past 90 deg)
  addSoftbox(13, 2.4, '#e0f2fe', 3.1, [-1.5, 2.8, -8.0], 0.4);
  addSoftbox(11, 1.5, '#60a5fa', 2.2, [2.2, -1.8, -8.2], 0.4);

  const rt = pmrem.fromScene(envScene, 0.02);
  for (const d of disposables) {
    d.dispose();
  }
  pmrem.dispose();
  return rt.texture;
}

const COOL_FACE_COLOR = new THREE.Color('#9ec7ff');
const COOL_BEVEL_COLOR = new THREE.Color('#f0f7ff');
const COOL_KEY_COLOR = new THREE.Color('#eef5ff');
const COOL_RIM_COLOR = new THREE.Color('#93c5fd');

const ALERT_FACE_COLOR = new THREE.Color('#d95763');
const ALERT_BEVEL_COLOR = new THREE.Color('#fee2e2');
const ALERT_KEY_COLOR = new THREE.Color('#fecaca');
const ALERT_RIM_COLOR = new THREE.Color('#ef4444');

/**
 * Interactive 60fps Three.js WebGL PBR scene rendering a sculpted liquid metallic-glass
 * 3D "VSH" monogram using genuine DM Serif Display foundry curves, dual-surface chrome/crystal
 * reflections, clearcoat iridescence, pointer parallax, and Prototipo IA / Tras VibeShield state.
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
    alertMix: mode === 'after' ? 0 : 1,
  });

  useEffect(() => {
    stateRef.current.mode = mode;
    stateRef.current.targetMouseX = mouseX;
    stateRef.current.targetMouseY = mouseY;
    renderOnceRef.current?.();
  }, [mode, mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Quietly verify WebGL availability before invoking Three.js (avoids noisy stderr in jsdom)
    let webglContext: RenderingContext | null = null;
    try {
      webglContext =
        canvas.getContext('webgl2', {
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }) ||
        canvas.getContext('webgl', {
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        });
    } catch {
      return;
    }
    if (!webglContext) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: webglContext as WebGLRenderingContext,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const envTexture = buildStudioEnvironment(renderer);
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 100);
    camera.position.set(0, -0.78, 12.8);
    camera.lookAt(0, -0.78, 0);

    const keyLight = new THREE.DirectionalLight(COOL_KEY_COLOR.clone(), 2.6);
    keyLight.position.set(4.8, 6.2, 6.4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(COOL_RIM_COLOR.clone(), 2.2);
    rimLight.position.set(-6.5, 2.5, -4.0);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight('#dbeafe', 1.6, 26);
    fillLight.position.set(-2.5, -3.2, 6.5);
    scene.add(fillLight);

    // Dual-surface Liquid Metallic Glass ("vidrio metálico"):
    // [0] Front & Back: luminous translucent liquid-chrome sapphire glass with prism iridescence
    const faceMaterial = new THREE.MeshPhysicalMaterial({
      color: COOL_FACE_COLOR.clone(),
      metalness: 0.86,
      roughness: 0.055,
      clearcoat: 1.0,
      clearcoatRoughness: 0.015,
      reflectivity: 1.0,
      ior: 1.75,
      iridescence: 0.82,
      iridescenceIOR: 1.4,
      iridescenceThicknessRange: [170, 450],
      envMapIntensity: 2.5,
      transparent: true,
      opacity: 0.84,
    });

    // [1] Curved 3D bevels & side walls: blazing mirror platinum-chrome optical glass
    const bevelMaterial = new THREE.MeshPhysicalMaterial({
      color: COOL_BEVEL_COLOR.clone(),
      metalness: 0.96,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.015,
      reflectivity: 1.0,
      ior: 1.85,
      iridescence: 0.6,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [200, 420],
      envMapIntensity: 3.2,
      transparent: true,
      opacity: 0.96,
    });

    const vshGroup = new THREE.Group();
    scene.add(vshGroup);

    const geometries: THREE.ExtrudeGeometry[] = [];
    const glyphEntries: {
      mesh: THREE.Mesh;
      spec: GlyphContourSpec;
      phase: number;
      dir: number;
    }[] = [];

    VSH_FOUNDRY_GLYPHS.forEach((spec, idx) => {
      const shape = buildShapeFromTrueType(spec.pts);
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.44,
        curveSegments: 28,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.015,
        bevelOffset: 0,
        bevelSegments: 8,
      });
      geometry.translate(0, 0, -0.22);
      geometry.computeVertexNormals();
      geometries.push(geometry);

      const mesh = new THREE.Mesh(geometry, [faceMaterial, bevelMaterial]);
      mesh.position.set(spec.centerX, 0, 0);
      vshGroup.add(mesh);

      glyphEntries.push({
        mesh,
        spec,
        phase: idx * 2.1,
        dir: idx === 1 ? 1 : -1,
      });
    });

    const syncViewport = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(rect.width, 320);
      const height = Math.max(rect.height, 320);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Frame VSH with generous clear margins from Navbar, exhibits, and center pill
      const isCompact = width < 1024;
      const responsiveScale = isCompact
        ? Math.min(0.76, Math.max(0.52, width / 960))
        : Math.min(0.86, Math.max(0.72, width / 1680));

      vshGroup.scale.setScalar(responsiveScale);
      // Center monogram cleanly at y ~ 29.5% of hero stage (above hotspot pill, below navbar)
      camera.position.y = isCompact ? -0.96 : -1.04;
      camera.lookAt(0, camera.position.y, 0);
    };

    let rafId = 0;
    let elapsed = 0;
    let lastNow = performance.now();

    const renderFrame = (now: number, scheduleNext: boolean) => {
      const rawDelta = (now - lastNow) / 1000;
      const dt = Math.min(Math.max(rawDelta, 0), 0.05);
      lastNow = now;

      const s = stateRef.current;
      const isHardened = s.mode === 'after';
      const targetAlert = isHardened ? 0 : 1;

      if (reducedMotion) {
        s.currentMouseX = 0;
        s.currentMouseY = 0;
        s.alertMix = targetAlert;
      } else {
        const smoothPointer = 1 - Math.exp(-5.0 * dt);
        const smoothState = 1 - Math.exp(-5.8 * dt);
        s.currentMouseX += (s.targetMouseX - s.currentMouseX) * smoothPointer;
        s.currentMouseY += (s.targetMouseY - s.currentMouseY) * smoothPointer;
        s.alertMix += (targetAlert - s.alertMix) * smoothState;
        elapsed += dt;
      }

      faceMaterial.color
        .copy(COOL_FACE_COLOR)
        .lerp(ALERT_FACE_COLOR, s.alertMix);
      bevelMaterial.color
        .copy(COOL_BEVEL_COLOR)
        .lerp(ALERT_BEVEL_COLOR, s.alertMix);
      keyLight.color.copy(COOL_KEY_COLOR).lerp(ALERT_KEY_COLOR, s.alertMix);
      rimLight.color.copy(COOL_RIM_COLOR).lerp(ALERT_RIM_COLOR, s.alertMix);

      vshGroup.rotation.y = reducedMotion
        ? -0.28
        : -0.28 + elapsed * 0.34 + s.currentMouseX * 0.45;
      vshGroup.rotation.x = reducedMotion
        ? 0.09
        : 0.08 + Math.sin(elapsed * 0.6) * 0.045 + s.currentMouseY * 0.18;
      vshGroup.position.x = s.currentMouseX * 0.2;
      vshGroup.position.y = reducedMotion
        ? 0
        : Math.sin(elapsed * 0.9) * 0.05 - s.currentMouseY * 0.1;

      for (const entry of glyphEntries) {
        const mix = s.alertMix;
        const driftY = reducedMotion
          ? entry.dir * 0.09 * mix
          : Math.sin(elapsed * 3.1 + entry.phase) * 0.095 * mix;
        const driftZ = reducedMotion
          ? entry.dir * 0.14 * mix
          : Math.cos(elapsed * 2.5 + entry.phase) * 0.16 * mix;
        const driftRotZ = reducedMotion
          ? entry.dir * 0.055 * mix
          : Math.sin(elapsed * 3.6 + entry.phase) * 0.065 * mix;

        entry.mesh.position.set(entry.spec.centerX, driftY, driftZ);
        entry.mesh.rotation.z = driftRotZ;
      }

      renderer.render(scene, camera);

      if (scheduleNext && !reducedMotion) {
        rafId = window.requestAnimationFrame((nextNow) =>
          renderFrame(nextNow, true),
        );
      }
    };

    const handleResize = () => {
      syncViewport();
      renderFrame(performance.now(), false);
    };

    renderOnceRef.current = () => {
      if (reducedMotion) {
        renderFrame(performance.now(), false);
      }
    };

    syncViewport();
    window.addEventListener('resize', handleResize);
    renderFrame(performance.now(), !reducedMotion);

    return () => {
      renderOnceRef.current = null;
      window.removeEventListener('resize', handleResize);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      for (const geo of geometries) {
        geo.dispose();
      }
      faceMaterial.dispose();
      bevelMaterial.dispose();
      envTexture.dispose();
      renderer.dispose();
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
