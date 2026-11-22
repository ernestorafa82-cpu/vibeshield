'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  VSH_FOUNDRY_GLYPHS,
  type GlyphContourSpec,
} from '@/components/landing/vsh-glyph-paths';

export interface HeroCanvasSceneProps {
  mode: 'before' | 'after';
  mouseX: number;
  mouseY: number;
  stageRef: React.RefObject<HTMLDivElement | null>;
}

// Exact physical half-extents of the plump blown-glass droplet VSH wordmark
// (measured Box3 ±2.562 x ±0.980 x ±0.295 plus alert drift margin)
export const VSH_PROJECTION_BOUNDS = {
  halfW: 2.57,
  halfH: 0.99,
  halfD: 0.38,
  maxRx: 0.22,
  maxRy: 0.56,
  maxPosX: 0.14,
  maxPosY: 0.11,
  cameraFov: 24,
  cameraZ: 14.0,
  margin: 0.97,
} as const;

/**
 * Computes the largest uniform scale for the rotating 3D VSH liquid-glass wordmark
 * such that all 8 corners of its rotated + drifted bounding box stay strictly inside
 * a target frustum rectangle of world size (stageWorldW x stageWorldH) at z = 0.
 */
export function computeVshFitScaleForStage(
  stageWorldW: number,
  stageWorldH: number,
  cameraZ: number = VSH_PROJECTION_BOUNDS.cameraZ,
): number {
  const safeW = Math.max(stageWorldW, 0.5);
  const safeH = Math.max(stageWorldH, 0.5);
  const { halfW, halfH, halfD, maxRx, maxRy, maxPosX, maxPosY, margin } =
    VSH_PROJECTION_BOUNDS;

  const halfStageW = safeW * 0.5 * margin;
  const halfStageH = safeH * 0.5 * margin;
  const slopeX = halfStageW / cameraZ;
  const slopeY = halfStageH / cameraZ;

  const yAfterRx = halfH * Math.cos(maxRx) + halfD * Math.sin(maxRx);
  const zAfterRx = halfH * Math.sin(maxRx) + halfD * Math.cos(maxRx);

  let fitScale = Infinity;
  for (const ry of [0, maxRy * 0.5, maxRy]) {
    const xRot = halfW * Math.cos(ry) + zAfterRx * Math.sin(ry);
    const zNear = halfW * Math.sin(ry) + zAfterRx * Math.cos(ry);
    const yWorst =
      halfH * Math.cos(maxRx) +
      (halfW * Math.sin(ry) + halfD * Math.cos(ry)) * Math.sin(maxRx);
    const zWorst =
      halfH * Math.sin(maxRx) +
      (halfW * Math.sin(ry) + halfD * Math.cos(ry)) * Math.cos(maxRx);

    const maxXExtent = Math.max(xRot, halfW * Math.cos(ry) + halfD * Math.sin(ry));
    const maxYExtent = Math.max(yAfterRx, yWorst);
    const maxZAdvance = Math.max(zNear, zWorst);

    const scaleX = (halfStageW - maxPosX) / (maxXExtent + maxZAdvance * slopeX);
    const scaleY = (halfStageH - maxPosY) / (maxYExtent + maxZAdvance * slopeY);
    fitScale = Math.min(fitScale, scaleX, scaleY);
  }

  return Math.max(0.1, fitScale);
}

/**
 * Convenience wrapper computing VSH scale from a container aspect ratio + camera FOV.
 */
export function computeVshFitScale(
  aspect: number,
  cameraFov: number = VSH_PROJECTION_BOUNDS.cameraFov,
  cameraZ: number = VSH_PROJECTION_BOUNDS.cameraZ,
): number {
  const safeAspect = Math.max(aspect, 0.25);
  const stageWorldH =
    2 * cameraZ * Math.tan(THREE.MathUtils.degToRad(cameraFov * 0.5));
  const stageWorldW = stageWorldH * safeAspect;
  return computeVshFitScaleForStage(stageWorldW, stageWorldH, cameraZ);
}

/**
 * Converts TrueType quadratic Bezier contour points ([x, y, onCurve]) into a
 * lossless THREE.Shape ready for plump blown-glass droplet extrusion.
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
 * Builds a studio reflection dome tailored for wet blown-glass water droplets:
 * razor-bright white crescent softboxes + cool glacier sky light + dark sapphire contrast
 * voids so thick curved glass forms gleaming liquid highlights and luminous Fresnel rims.
 */
function buildDropletStudioEnvironment(
  renderer: THREE.WebGLRenderer,
): THREE.WebGLRenderTarget {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color('#061229');

  const disposables: { dispose: () => void }[] = [];

  const addLightPanel = (
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

  // Pure white wet-droplet specular crescent light strips (upper-right & crown)
  addLightPanel(12, 2.0, '#ffffff', 5.2, [3.2, 5.4, 7.2], -0.38);
  addLightPanel(11, 1.4, '#eef6ff', 4.4, [-2.8, 6.2, 4.2], 0.28);
  // Wide soft glacier horizon bounce
  addLightPanel(14, 1.8, '#93c5fd', 2.8, [-4.5, -1.5, 7.6], -0.22);
  // Crisp side rim lights outlining the swollen droplet silhouettes in pure white-ice
  addLightPanel(2.4, 11.0, '#ffffff', 4.8, [7.8, 1.2, 1.2]);
  addLightPanel(2.6, 11.0, '#dbeafe', 4.2, [-7.8, 1.8, 0.8]);
  // Lower sapphire caustic bounce
  addLightPanel(13, 3.2, '#3b82f6', 2.4, [0, -7.2, 2.8]);

  const rt = pmrem.fromScene(envScene, 0.018);
  for (const d of disposables) {
    d.dispose();
  }
  pmrem.dispose();
  return rt;
}

const COOL_ATTENUATION = new THREE.Color('#3b82f6');
const COOL_TINT = new THREE.Color('#ffffff');
const COOL_BACKDROP_TINT = new THREE.Color('#ffffff');

const ALERT_ATTENUATION = new THREE.Color('#dc2626');
const ALERT_TINT = new THREE.Color('#fff1f2');
const ALERT_BACKDROP_TINT = new THREE.Color('#ffd6d6');

/**
 * Full-hero Three.js WebGL PBR liquid-glass scene:
 * - Renders `/images/hero-backdrop.jpg` inside the 3D scene so true `transmission: 1.0`
 *   physically bends, magnifies, and prism-disperses the fluted studio light rays through
 *   plump, rounded blown-glass water-droplet "VSH" letters.
 * - Dynamically locks the 3D VSH wordmark to the exact DOM rect of `stageRef` via
 *   ResizeObserver + perspective frustum math, ensuring zero overlap on mobile and desktop.
 */
export function HeroCanvasScene({
  mode,
  mouseX,
  mouseY,
  stageRef,
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
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x07142b, 0);

    const scene = new THREE.Scene();
    const envTarget = buildDropletStudioEnvironment(renderer);
    scene.environment = envTarget.texture;

    const { cameraFov, cameraZ } = VSH_PROJECTION_BOUNDS;
    const camera = new THREE.PerspectiveCamera(cameraFov, 16 / 9, 0.1, 100);
    camera.position.set(0, 0, cameraZ);
    camera.lookAt(0, 0, 0);

    // MUST be opaque (transparent: false) so Three.js physical transmission pass
    // renders the fluted light backdrop into the refraction buffer behind the droplets!
    // Keep invisible until texture loads (or on error) so SSR <img> shines through with zero flash.
    const backdropZ = -3.8;
    const backdropGeo = new THREE.PlaneGeometry(1, 1);
    const backdropMat = new THREE.MeshBasicMaterial({
      color: COOL_BACKDROP_TINT.clone(),
      transparent: false,
      depthWrite: true,
    });
    const backdropMesh = new THREE.Mesh(backdropGeo, backdropMat);
    backdropMesh.position.set(0, 0, backdropZ);
    backdropMesh.visible = false;
    scene.add(backdropMesh);

    let backdropTexture: THREE.Texture | null = null;
    let backdropImgAspect = 16 / 9;
    let isDisposed = false;

    const loader = new THREE.TextureLoader();
    loader.load(
      '/images/hero-backdrop.jpg',
      (tex) => {
        if (isDisposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        backdropTexture = tex;
        const img = tex.image as { width?: number; height?: number } | undefined;
        if (img?.width && img?.height) {
          backdropImgAspect = img.width / img.height;
        }
        backdropMat.map = tex;
        backdropMat.color.copy(COOL_BACKDROP_TINT);
        backdropMat.needsUpdate = true;
        backdropMesh.visible = true;
        syncViewport();
        renderFrame(performance.now(), false);
      },
      undefined,
      () => {
        // Leave backdropMesh hidden on texture error so the underlying SSR <img> stays visible
        backdropMesh.visible = false;
      },
    );

    const keyLight = new THREE.DirectionalLight('#ffffff', 2.4);
    keyLight.position.set(4.5, 6.8, 7.0);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#bfdbfe', 2.0);
    rimLight.position.set(-6.5, 3.0, -3.5);
    scene.add(rimLight);

    // True Blown-Glass Water-Droplet Material ("vidrio en forma de gota"):
    // 100% physical transmission refracting the fluted light rays + crystal dispersion + wet clearcoat!
    const dropletGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: COOL_TINT.clone(),
      transmission: 1.0,
      opacity: 1,
      transparent: false,
      thickness: 2.6,
      ior: 1.52,
      dispersion: 5.5,
      roughness: 0.015,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.008,
      specularIntensity: 1.6,
      specularColor: new THREE.Color('#ffffff'),
      attenuationColor: COOL_ATTENUATION.clone(),
      attenuationDistance: 2.1,
      envMapIntensity: 2.7,
    });

    const vshAnchor = new THREE.Group();
    const vshGroup = new THREE.Group();
    vshAnchor.add(vshGroup);
    scene.add(vshAnchor);

    const geometries: THREE.BufferGeometry[] = [];
    const glyphEntries: {
      mesh: THREE.Mesh;
      spec: GlyphContourSpec;
      phase: number;
      dir: number;
    }[] = [];

    VSH_FOUNDRY_GLYPHS.forEach((spec, idx) => {
      const shape = buildShapeFromTrueType(spec.pts);
      const rawGeo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.05,
        curveSegments: 22,
        bevelEnabled: true,
        bevelThickness: 0.27,
        bevelSize: 0.105,
        bevelOffset: -0.085,
        bevelSegments: 16,
      });
      rawGeo.translate(0, 0, -0.025);
      // Remove hard face normals & split UVs so front/back caps and 16 bevel rings weld into
      // ONE silky-smooth, pillowy blown-glass droplet surface with zero hard creases
      rawGeo.deleteAttribute('normal');
      rawGeo.deleteAttribute('uv');
      const weldedGeo = mergeVertices(rawGeo, 1e-4);
      rawGeo.dispose();
      weldedGeo.computeVertexNormals();
      geometries.push(weldedGeo);

      const mesh = new THREE.Mesh(weldedGeo, dropletGlassMaterial);
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
      const canvasRect = canvas.getBoundingClientRect();
      const width = Math.max(canvasRect.width, 320);
      const height = Math.max(canvasRect.height, 320);
      const aspect = width / height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      // Size the Three.js backdrop plane to exact CSS object-cover + 1.08x parallax bleed
      const distBackdrop = cameraZ - backdropZ;
      const bgVisH =
        2 * distBackdrop * Math.tan(THREE.MathUtils.degToRad(cameraFov * 0.5));
      const bgVisW = bgVisH * aspect;
      const coverScale = 1.08;
      if (aspect > backdropImgAspect) {
        backdropMesh.scale.set(
          bgVisW * coverScale,
          (bgVisW / backdropImgAspect) * coverScale,
          1,
        );
      } else {
        backdropMesh.scale.set(
          bgVisH * backdropImgAspect * coverScale,
          bgVisH * coverScale,
          1,
        );
      }

      // Lock VSH mathematically inside stageRef's exact pixel rectangle at z = 0
      const fullVisH =
        2 * cameraZ * Math.tan(THREE.MathUtils.degToRad(cameraFov * 0.5));
      const fullVisW = fullVisH * aspect;

      const stageEl = stageRef.current;
      if (stageEl) {
        const stageRect = stageEl.getBoundingClientRect();
        if (stageRect.width > 40 && stageRect.height > 40) {
          const cxPx =
            stageRect.left - canvasRect.left + stageRect.width * 0.5;
          const cyPx =
            stageRect.top - canvasRect.top + stageRect.height * 0.5;
          const ndcX = (cxPx / width) * 2 - 1;
          const ndcY = 1 - (cyPx / height) * 2;

          vshAnchor.position.set(
            ndcX * fullVisW * 0.5,
            ndcY * fullVisH * 0.5,
            0,
          );

          const stageWorldW = fullVisW * (stageRect.width / width);
          const stageWorldH = fullVisH * (stageRect.height / height);
          vshGroup.scale.setScalar(
            computeVshFitScaleForStage(stageWorldW, stageWorldH, cameraZ),
          );
          return;
        }
      }

      vshAnchor.position.set(0, fullVisH * 0.14, 0);
      vshGroup.scale.setScalar(computeVshFitScale(aspect, cameraFov, cameraZ));
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
        const smoothState = 1 - Math.exp(-5.5 * dt);
        s.currentMouseX += (s.targetMouseX - s.currentMouseX) * smoothPointer;
        s.currentMouseY += (s.targetMouseY - s.currentMouseY) * smoothPointer;
        s.alertMix += (targetAlert - s.alertMix) * smoothState;
        elapsed += dt;
      }

      // Smoothly transition liquid glass crystal tint between glacier-ice and crimson alert
      dropletGlassMaterial.attenuationColor
        .copy(COOL_ATTENUATION)
        .lerp(ALERT_ATTENUATION, s.alertMix);
      dropletGlassMaterial.color
        .copy(COOL_TINT)
        .lerp(ALERT_TINT, s.alertMix);
      // Only apply tint once the texture is mounted so initial load stays deep sapphire
      if (backdropMat.map) {
        backdropMat.color
          .copy(COOL_BACKDROP_TINT)
          .lerp(ALERT_BACKDROP_TINT, s.alertMix);
      }

      // Gentle studio backdrop parallax refracting behind the droplets
      backdropMesh.position.x = -s.currentMouseX * 0.34;
      backdropMesh.position.y = s.currentMouseY * 0.22;

      // Forward-facing buoyant liquid-droplet 3D sway (±20° + pointer tilt)
      vshGroup.rotation.y = reducedMotion
        ? -0.2
        : Math.sin(elapsed * 0.6 - 0.45) * 0.35 + s.currentMouseX * 0.21;
      vshGroup.rotation.x = reducedMotion
        ? 0.06
        : 0.05 + Math.sin(elapsed * 0.85) * 0.045 + s.currentMouseY * 0.12;
      vshGroup.position.x = s.currentMouseX * 0.14;
      vshGroup.position.y = reducedMotion
        ? 0
        : Math.sin(elapsed * 1.1) * 0.05 - s.currentMouseY * 0.06;

      for (const entry of glyphEntries) {
        const mix = s.alertMix;
        const driftY = reducedMotion
          ? entry.dir * 0.07 * mix
          : Math.sin(elapsed * 3.0 + entry.phase) * 0.08 * mix;
        const driftZ = reducedMotion
          ? entry.dir * 0.1 * mix
          : Math.cos(elapsed * 2.4 + entry.phase) * 0.12 * mix;
        const driftRotZ = reducedMotion
          ? entry.dir * 0.04 * mix
          : Math.sin(elapsed * 3.4 + entry.phase) * 0.05 * mix;

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

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(canvas);
      if (stageRef.current) {
        resizeObserver.observe(stageRef.current);
      }
    }

    renderFrame(performance.now(), !reducedMotion);

    return () => {
      isDisposed = true;
      renderOnceRef.current = null;
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      for (const geo of geometries) {
        geo.dispose();
      }
      backdropGeo.dispose();
      backdropMat.dispose();
      backdropTexture?.dispose();
      dropletGlassMaterial.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, [stageRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 block h-full w-full"
    />
  );
}
