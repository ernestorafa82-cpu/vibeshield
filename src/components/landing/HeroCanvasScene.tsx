'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  mergeVertices,
  toCreasedNormals,
} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
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

// Physical half-extents of the cut optical-crystal VSH wordmark
// (measured Box3 ±2.56 x ±0.98 x ±0.30 plus alert drift margin)
export const VSH_PROJECTION_BOUNDS = {
  halfW: 2.57,
  halfH: 0.99,
  halfD: 0.42,
  maxRx: 0.22,
  maxRy: 0.56,
  maxPosX: 0.14,
  maxPosY: 0.11,
  cameraFov: 24,
  cameraZ: 14.0,
  margin: 0.97,
} as const;

/**
 * Computes the largest uniform scale for the rotating 3D VSH crystal wordmark
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
 * lossless THREE.Shape ready for thick optical-crystal extrusion.
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
 * Builds a high-contrast optical crystal photography reflection dome (PMREM):
 * alternating blazing pure-white diamond reflection ribbons and deep midnight-sapphire
 * contrast flags around grazing angles so cut crystal bevels produce authentic
 * total-internal-reflection dark blue + pure white liquid glass bands.
 */
function buildCrystalStudioEnvironment(
  renderer: THREE.WebGLRenderer,
): THREE.WebGLRenderTarget {
  const pmrem = new THREE.PMREMGenerator(renderer);

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color('#04102b');

  const disposables: { dispose: () => void }[] = [];

  const addPanel = (
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

  // Razor-bright pure-white diamond specular strips alternating with deep sapphire dark flags
  // Overhead & upper-diagonal studio strip lights (blazing white crystal crown highlights)
  addPanel(14, 1.5, '#ffffff', 7.5, [0.5, 6.8, 3.2], -0.18);
  addPanel(12, 1.2, '#f0f7ff', 6.5, [4.6, 4.8, 5.2], -0.45);
  addPanel(10, 1.0, '#ffffff', 5.8, [-4.8, 4.6, 4.6], 0.42);

  // Deep sapphire optical contrast flags positioned right next to the white strips
  // (this is what creates the dark navy-blue total-internal-reflection edges in cut glass!)
  addPanel(16, 2.2, '#020b26', 0.25, [0, 3.4, 7.2], -0.15);
  addPanel(3.4, 12.0, '#031238', 0.3, [6.2, 0.2, 4.5]);
  addPanel(3.4, 12.0, '#031238', 0.3, [-6.2, 0.2, 4.5]);

  // Grazing perimeter pure-white crystal rim strips (left, right, lower-front)
  addPanel(1.6, 12.0, '#ffffff', 7.2, [8.2, 0.8, 0.4]);
  addPanel(1.6, 12.0, '#e6f2ff', 6.8, [-8.2, 1.0, 0.4]);
  addPanel(14, 1.4, '#dbeafe', 5.0, [0, -5.8, 4.8]);

  // Subtle cobalt-ice mid-tone fill strips for crystalline edge depth
  addPanel(12, 1.8, '#60a5fa', 2.8, [3.2, -2.5, 7.5], -0.35);
  addPanel(12, 1.8, '#93c5fd', 3.0, [-3.6, -2.2, 7.2], 0.32);

  // Back hemisphere light panels illuminating back-wall crystal reflections
  addPanel(13, 2.0, '#ffffff', 5.5, [0, 4.2, -7.8]);
  addPanel(14, 2.2, '#3b82f6', 2.4, [0, -4.0, -7.6]);

  const rt = pmrem.fromScene(envScene, 0.012);
  for (const d of disposables) {
    d.dispose();
  }
  pmrem.dispose();
  return rt;
}

/**
 * Generates a delicate procedural optical floor caustic glow texture (refracted light
 * rays dispersing softly beneath the crystal feet of V, S, and H).
 */
function buildCausticFloorTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 160;
  const ctx = c.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, c.width, c.height);

  // Three optical caustic pools aligned under V, S, and H feet
  const pools = [
    { x: 108, rx: 86, ry: 34 },
    { x: 262, rx: 92, ry: 36 },
    { x: 408, rx: 88, ry: 34 },
  ];

  for (const p of pools) {
    // Soft white-ice core caustic pool
    const grad = ctx.createRadialGradient(p.x, 78, 2, p.x, 78, p.rx);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    grad.addColorStop(0.32, 'rgba(191, 219, 254, 0.34)');
    grad.addColorStop(0.68, 'rgba(96, 165, 250, 0.10)');
    grad.addColorStop(1, 'rgba(96, 165, 250, 0)');

    ctx.save();
    ctx.translate(p.x, 78);
    ctx.scale(1, p.ry / p.rx);
    ctx.translate(-p.x, -78);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, 78, p.rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Subtle refracted prism light streaks radiating outward from the crystal base
    for (let i = -3; i <= 3; i++) {
      const angle = i * 0.24;
      const len = 54 + (Math.abs(i) % 2) * 20;
      const gx = p.x + Math.sin(angle) * len;
      const gy = 78 + Math.cos(angle) * len * 0.26;
      const rayGrad = ctx.createLinearGradient(p.x, 78, gx, gy);
      rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
      rayGrad.addColorStop(
        0.55,
        i % 2 === 0
          ? 'rgba(186, 230, 253, 0.16)'
          : 'rgba(254, 240, 215, 0.13)',
      );
      rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.strokeStyle = rayGrad;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(p.x, 78);
      ctx.lineTo(gx, gy);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const COOL_ATTENUATION = new THREE.Color('#dbeeff');
const COOL_TINT = new THREE.Color('#ffffff');
const COOL_BACKDROP_TINT = new THREE.Color('#ffffff');
const COOL_CAUSTIC_TINT = new THREE.Color('#e8f4ff');
const COOL_RIM_DEEP = new THREE.Color('#093b94');
const COOL_RIM_MID = new THREE.Color('#2b80f2');

const ALERT_ATTENUATION = new THREE.Color('#fca5a5');
const ALERT_TINT = new THREE.Color('#fff5f5');
const ALERT_BACKDROP_TINT = new THREE.Color('#ffd6d6');
const ALERT_CAUSTIC_TINT = new THREE.Color('#fecaca');
const ALERT_RIM_DEEP = new THREE.Color('#8c1d24');
const ALERT_RIM_MID = new THREE.Color('#ef4444');

const CRYSTAL_FRESNEL_VERTEX = /* glsl */ `
  varying vec3 vViewNormal;
  varying vec3 vViewPos;
  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mvPos.xyz;
    vec3 rawNormal = normalMatrix * normal;
    vViewNormal = length(rawNormal) > 1e-6 ? normalize(rawNormal) : vec3(0.0, 0.0, 1.0);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const CRYSTAL_FRESNEL_FRAGMENT = /* glsl */ `
  uniform vec3 uDeepColor;
  uniform vec3 uMidColor;
  varying vec3 vViewNormal;
  varying vec3 vViewPos;

  void main() {
    vec3 N = length(vViewNormal) > 1e-6 ? normalize(vViewNormal) : vec3(0.0, 0.0, 1.0);
    vec3 V = normalize(vViewPos);
    float ndotv = clamp(abs(dot(N, V)), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 1.85);

    // Dual studio key & rim light directions matching hero-backdrop.jpg
    vec3 L1 = normalize(vec3(0.42, 0.72, 0.56));
    vec3 L2 = normalize(vec3(-0.68, 0.36, 0.62));
    vec3 H1 = normalize(L1 + V);
    vec3 H2 = normalize(L2 + V);
    float spec1 = pow(max(dot(N, H1), 0.0), 54.0);
    float spec2 = pow(max(dot(N, H2), 0.0), 42.0);
    float spec = clamp(spec1 * 1.45 + spec2 * 0.95, 0.0, 1.0);

    // Jewel sapphire total-internal-reflection band on curved bevel walls,
    // transitioning to razor-bright pure white diamond glints on grazing rims
    float deepBand = smoothstep(0.14, 0.52, fresnel) * (1.0 - smoothstep(0.68, 0.96, fresnel) * 0.55);
    float midBand = smoothstep(0.08, 0.42, fresnel) * (1.0 - smoothstep(0.48, 0.85, fresnel));
    float whiteRim = smoothstep(0.56, 0.92, fresnel);

    vec3 col = mix(uMidColor, uDeepColor, clamp(deepBand * 1.25, 0.0, 1.0));
    col = mix(col, vec3(1.55, 1.62, 1.7), clamp(whiteRim * 0.78 + spec, 0.0, 1.0));

    float alpha = clamp(midBand * 0.34 + deepBand * 0.64 + whiteRim * 0.76 + spec * 0.88, 0.0, 0.92);
    gl_FragColor = vec4(col, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/**
 * Full-hero Three.js WebGL PBR cut-crystal liquid-glass scene:
 * - Renders `/images/hero-backdrop.jpg` inside the 3D scene so true `transmission: 1.0`
 *   physically refracts the fluted studio light rays through crystal-clear cut-glass "VSH" letters.
 * - Uses dual-pass optical crystal rendering (BackSide internal bevel wall reflections +
 *   FrontSide clear diamond glass with `ior: 1.54`, `dispersion: 7.5`, and crisp curved bevels)
 *   plus subtle floor caustics under V, S, and H.
 * - Dynamically locks VSH strictly inside `stageRef` via ResizeObserver + frustum math.
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
    renderer.toneMappingExposure = 1.22;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x07142b, 0);

    const scene = new THREE.Scene();
    const envTarget = buildCrystalStudioEnvironment(renderer);
    scene.environment = envTarget.texture;

    const { cameraFov, cameraZ } = VSH_PROJECTION_BOUNDS;
    const camera = new THREE.PerspectiveCamera(cameraFov, 16 / 9, 0.1, 100);
    camera.position.set(0, 0, cameraZ);
    camera.lookAt(0, 0, 0);

    // Opaque backdrop plane (hidden until texture loads or on error so SSR <img> shines cleanly)
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
        backdropMesh.visible = false;
      },
    );

    const keyLight = new THREE.DirectionalLight('#ffffff', 3.0);
    keyLight.position.set(4.5, 7.2, 6.8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#dbeafe', 2.4);
    rimLight.position.set(-7.0, 2.8, -3.5);
    scene.add(rimLight);

    // Pass 1 (Water-Clear Cut Crystal Shell): pure transparent optical crystal with
    // real backdrop transmission, grazing reflections, and prismatic diamond dispersion!
    const outerCrystalMaterial = new THREE.MeshPhysicalMaterial({
      color: COOL_TINT.clone(),
      transmission: 1.0,
      opacity: 1,
      transparent: false,
      thickness: 1.85,
      ior: 1.54,
      dispersion: 7.5,
      roughness: 0.01,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      specularIntensity: 2.0,
      specularColor: new THREE.Color('#ffffff'),
      attenuationColor: COOL_ATTENUATION.clone(),
      attenuationDistance: 9.0,
      iridescence: 0.36,
      iridescenceIOR: 1.48,
      iridescenceThicknessRange: [140, 380],
      envMapIntensity: 3.6,
      side: THREE.FrontSide,
    });

    // Pass 2 (Optical Total-Internal-Reflection Fresnel Rim + Diamond Specular Glints):
    // Keeps flat centers 100% water-clear while painting crisp deep-sapphire + pure-white
    // refractive glass bands along every curved crystal bevel (with polygonOffset to avoid z-fighting).
    const fresnelUniforms = {
      uDeepColor: { value: COOL_RIM_DEEP.clone() },
      uMidColor: { value: COOL_RIM_MID.clone() },
    };
    const fresnelRimMaterial = new THREE.ShaderMaterial({
      uniforms: fresnelUniforms,
      vertexShader: CRYSTAL_FRESNEL_VERTEX,
      fragmentShader: CRYSTAL_FRESNEL_FRAGMENT,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      side: THREE.FrontSide,
    });

    const vshAnchor = new THREE.Group();
    const vshGroup = new THREE.Group();
    vshAnchor.add(vshGroup);
    scene.add(vshAnchor);

    // Delicate refracted floor caustic light reflection beneath V, S, H
    const causticTexture = buildCausticFloorTexture();
    const causticGeo = new THREE.PlaneGeometry(5.6, 1.45);
    const causticMat = new THREE.MeshBasicMaterial({
      map: causticTexture,
      color: COOL_CAUSTIC_TINT.clone(),
      transparent: true,
      opacity: causticTexture ? 0.44 : 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const causticMesh = new THREE.Mesh(causticGeo, causticMat);
    causticMesh.position.set(0.05, -1.04, -0.08);
    vshGroup.add(causticMesh);

    const geometries: THREE.BufferGeometry[] = [];
    const glyphEntries: {
      holder: THREE.Group;
      spec: GlyphContourSpec;
      phase: number;
      dir: number;
    }[] = [];

    VSH_FOUNDRY_GLYPHS.forEach((spec, idx) => {
      const shape = buildShapeFromTrueType(spec.pts);
      // Thick cut optical crystal: deep 0.36 body so the inner back-bevel refracts cleanly
      // inside the clear front window, framed by smooth 8-segment curved crystal bevel rims!
      const rawGeo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.36,
        curveSegments: 24,
        bevelEnabled: true,
        bevelThickness: 0.12,
        bevelSize: 0.068,
        bevelOffset: -0.045,
        bevelSegments: 8,
      });
      rawGeo.translate(0, 0, -0.18);
      rawGeo.deleteAttribute('normal');
      rawGeo.deleteAttribute('uv');
      const weldedGeo = mergeVertices(rawGeo, 1e-4);
      rawGeo.dispose();
      // Smooth curved bevel rings while keeping the clear front/back optical window crisp
      const crystalGeo = toCreasedNormals(weldedGeo, Math.PI / 3.8);
      weldedGeo.dispose();
      geometries.push(crystalGeo);

      const holder = new THREE.Group();
      holder.position.set(spec.centerX, 0, 0);

      const outerMesh = new THREE.Mesh(crystalGeo, outerCrystalMaterial);
      outerMesh.renderOrder = 1;
      const fresnelMesh = new THREE.Mesh(crystalGeo, fresnelRimMaterial);
      fresnelMesh.renderOrder = 2;

      holder.add(outerMesh, fresnelMesh);
      vshGroup.add(holder);

      glyphEntries.push({
        holder,
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

      // Size Three.js backdrop plane to exact CSS object-cover + 1.08x parallax bleed
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

      outerCrystalMaterial.attenuationColor
        .copy(COOL_ATTENUATION)
        .lerp(ALERT_ATTENUATION, s.alertMix);
      outerCrystalMaterial.color
        .copy(COOL_TINT)
        .lerp(ALERT_TINT, s.alertMix);
      fresnelUniforms.uDeepColor.value
        .copy(COOL_RIM_DEEP)
        .lerp(ALERT_RIM_DEEP, s.alertMix);
      fresnelUniforms.uMidColor.value
        .copy(COOL_RIM_MID)
        .lerp(ALERT_RIM_MID, s.alertMix);
      causticMat.color
        .copy(COOL_CAUSTIC_TINT)
        .lerp(ALERT_CAUSTIC_TINT, s.alertMix);
      if (backdropMat.map) {
        backdropMat.color
          .copy(COOL_BACKDROP_TINT)
          .lerp(ALERT_BACKDROP_TINT, s.alertMix);
      }

      backdropMesh.position.x = -s.currentMouseX * 0.34;
      backdropMesh.position.y = s.currentMouseY * 0.22;

      // Forward-facing sculptural 3D crystal sway (±20° + pointer tilt)
      vshGroup.rotation.y = reducedMotion
        ? -0.2
        : Math.sin(elapsed * 0.6 - 0.45) * 0.35 + s.currentMouseX * 0.21;
      vshGroup.rotation.x = reducedMotion
        ? 0.05
        : 0.045 + Math.sin(elapsed * 0.85) * 0.04 + s.currentMouseY * 0.12;
      vshGroup.position.x = s.currentMouseX * 0.14;
      vshGroup.position.y = reducedMotion
        ? 0
        : Math.sin(elapsed * 1.1) * 0.045 - s.currentMouseY * 0.06;

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

        entry.holder.position.set(entry.spec.centerX, driftY, driftZ);
        entry.holder.rotation.z = driftRotZ;
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
      causticGeo.dispose();
      causticMat.dispose();
      causticTexture?.dispose();
      outerCrystalMaterial.dispose();
      fresnelRimMaterial.dispose();
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
