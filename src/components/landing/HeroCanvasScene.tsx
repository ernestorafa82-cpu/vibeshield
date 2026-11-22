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
export const VSH_PROJECTION_BOUNDS = {
  halfW: 2.57,
  halfH: 1.05,
  halfD: 0.43,
  maxRx: 0.22,
  maxRy: 0.56,
  maxPosX: 0.14,
  maxPosY: 0.11,
  cameraFov: 24,
  cameraZ: 14.0,
  margin: 0.97,
} as const;

export const MAX_SDF_SEGMENTS = 72;

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
export function buildShapeFromTrueType(
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
 * Extracts a CCW-oriented array of 2D contour segments [ax, ay, bx, by] (capped at
 * MAX_SDF_SEGMENTS) so the fragment shader can evaluate exact analytical Euclidean
 * distance to the letter perimeter, wide 42° diamond-cut chamfer facets, 45° corner
 * miter ridges, and refracted back-wall bevel contours at infinite vector resolution.
 */
export function extractContourSegments(shape: THREE.Shape): {
  segments: THREE.Vector4[];
  count: number;
} {
  const rawPts = shape.getPoints(2);
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < rawPts.length; i++) {
    const p = rawPts[i];
    const prev = pts[pts.length - 1];
    if (!prev || prev.distanceTo(p) > 1e-4) {
      pts.push(p.clone());
    }
  }
  if (pts.length > 1 && pts[0].distanceTo(pts[pts.length - 1]) < 1e-4) {
    pts.pop();
  }

  // Ensure CCW winding in Y-up so inward normal of (a -> b) is (-(by - ay), bx - ax)
  let area2 = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    area2 += a.x * b.y - b.x * a.y;
  }
  if (area2 < 0) {
    pts.reverse();
  }

  // If point count exceeds MAX_SDF_SEGMENTS, decimate shortest segments cleanly
  while (pts.length > MAX_SDF_SEGMENTS) {
    let minLen = Infinity;
    let minIdx = 0;
    for (let i = 0; i < pts.length; i++) {
      const len = pts[i].distanceTo(pts[(i + 1) % pts.length]);
      if (len < minLen) {
        minLen = len;
        minIdx = i;
      }
    }
    pts.splice((minIdx + 1) % pts.length, 1);
  }

  const segments: THREE.Vector4[] = [];
  for (let i = 0; i < MAX_SDF_SEGMENTS; i++) {
    if (i < pts.length) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      segments.push(new THREE.Vector4(a.x, a.y, b.x, b.y));
    } else {
      segments.push(new THREE.Vector4(0, 0, 0, 0));
    }
  }

  return { segments, count: pts.length };
}

/**
 * Builds a high-contrast optical crystal photography reflection dome (PMREM).
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

  addPanel(14, 1.5, '#ffffff', 7.5, [0.5, 6.8, 3.2], -0.18);
  addPanel(12, 1.2, '#f0f7ff', 6.5, [4.6, 4.8, 5.2], -0.45);
  addPanel(10, 1.0, '#ffffff', 5.8, [-4.8, 4.6, 4.6], 0.42);

  addPanel(16, 2.2, '#020b26', 0.25, [0, 3.4, 7.2], -0.15);
  addPanel(3.4, 12.0, '#031238', 0.3, [6.2, 0.2, 4.5]);
  addPanel(3.4, 12.0, '#031238', 0.3, [-6.2, 0.2, 4.5]);

  addPanel(1.6, 12.0, '#ffffff', 7.2, [8.2, 0.8, 0.4]);
  addPanel(1.6, 12.0, '#e6f2ff', 6.8, [-8.2, 1.0, 0.4]);
  addPanel(14, 1.4, '#dbeafe', 5.0, [0, -5.8, 4.8]);

  addPanel(12, 1.8, '#60a5fa', 2.8, [3.2, -2.5, 7.5], -0.35);
  addPanel(12, 1.8, '#93c5fd', 3.0, [-3.6, -2.2, 7.2], 0.32);

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
 * Generates a realistic starburst prismatic floor caustic texture under the 4 crystal
 * contact points (V apex, S lower curve, H left foot, H right foot) with warm-amber
 * and cool-cyan dispersion streaks matching raytraced optical crystal caustics.
 */
function buildCausticFloorTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 768;
  c.height = 220;
  const ctx = c.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, c.width, c.height);

  // 4 exact crystal contact bases in normalized canvas X (mapped across width 5.5)
  const feet = [
    { x: 148, rx: 110, ry: 44 }, // V bottom apex
    { x: 398, rx: 132, ry: 48 }, // S bottom curve
    { x: 548, rx: 95, ry: 42 },  // H left foot
    { x: 676, rx: 95, ry: 42 },  // H right foot
  ];

  for (const f of feet) {
    const cy = 86;

    // 1. Soft diffuse ice-blue floor reflection pool
    const pool = ctx.createRadialGradient(f.x, cy + 12, 2, f.x, cy + 12, f.rx);
    pool.addColorStop(0, 'rgba(255, 255, 255, 0.78)');
    pool.addColorStop(0.26, 'rgba(186, 230, 253, 0.46)');
    pool.addColorStop(0.58, 'rgba(56, 189, 248, 0.16)');
    pool.addColorStop(1, 'rgba(37, 99, 235, 0)');

    ctx.save();
    ctx.translate(f.x, cy + 12);
    ctx.scale(1, f.ry / f.rx);
    ctx.translate(-f.x, -(cy + 12));
    ctx.fillStyle = pool;
    ctx.beginPath();
    ctx.arc(f.x, cy + 12, f.rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Sharp starburst prismatic caustic rays fanning out from the crystal contact point
    const rayAngles = [-1.18, -0.82, -0.52, -0.24, 0.0, 0.24, 0.52, 0.82, 1.18];
    for (let idx = 0; idx < rayAngles.length; idx++) {
      const a = rayAngles[idx];
      const len = 76 + ((idx * 17) % 34);
      const ex = f.x + Math.sin(a) * len * 1.15;
      const ey = cy + Math.cos(a) * len * 0.52;

      // Chromatic dispersion: alternate warm golden-amber & electric ice-cyan caustic edges
      const isWarm = idx % 2 === 1;
      const rayGrad = ctx.createLinearGradient(f.x, cy, ex, ey);
      rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.82)');
      rayGrad.addColorStop(
        0.38,
        isWarm ? 'rgba(253, 224, 151, 0.42)' : 'rgba(125, 211, 252, 0.48)',
      );
      rayGrad.addColorStop(
        0.72,
        isWarm ? 'rgba(251, 191, 36, 0.14)' : 'rgba(56, 189, 248, 0.16)',
      );
      rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = rayGrad;
      ctx.lineWidth = idx === 4 ? 4.2 : 2.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(f.x, cy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }

    // 3. Hot pinpoint diamond-white caustic core directly under the crystal edge
    const core = ctx.createRadialGradient(f.x, cy, 1, f.x, cy, 26);
    core.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
    core.addColorStop(0.45, 'rgba(224, 242, 254, 0.52)');
    core.addColorStop(1, 'rgba(224, 242, 254, 0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(f.x, cy, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const COOL_ATTENUATION = new THREE.Color('#b8dcff');
const COOL_TINT = new THREE.Color('#f5faff');
// Tone the fluted backdrop to rich steel-sapphire studio blue so blazing #FFFFFF
// diamond crystal highlights & floor caustics pop with full HDR contrast!
const COOL_BACKDROP_TINT = new THREE.Color('#86b2e6');
const COOL_CAUSTIC_TINT = new THREE.Color('#ffffff');
const COOL_RIM_DEEP = new THREE.Color('#021b52');
const COOL_RIM_MID = new THREE.Color('#1868e0');
const COOL_ICE_GLOW = new THREE.Color('#9cd4ff');

const ALERT_ATTENUATION = new THREE.Color('#fca5a5');
const ALERT_TINT = new THREE.Color('#fff5f5');
const ALERT_BACKDROP_TINT = new THREE.Color('#d48a94');
const ALERT_CAUSTIC_TINT = new THREE.Color('#fecaca');
const ALERT_RIM_DEEP = new THREE.Color('#691118');
const ALERT_RIM_MID = new THREE.Color('#e11d48');
const ALERT_ICE_GLOW = new THREE.Color('#fda4af');

const CRYSTAL_JEWEL_VERTEX = /* glsl */ `
  varying vec3 vLocalPos;
  varying vec3 vLocalNormal;
  varying vec3 vViewNormal;
  varying vec3 vViewPos;
  varying vec3 vNormCol0;
  varying vec3 vNormCol1;
  varying vec3 vNormCol2;

  void main() {
    vLocalPos = position;
    vLocalNormal = length(normal) > 1e-6 ? normalize(normal) : vec3(0.0, 0.0, 1.0);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mvPos.xyz;
    vec3 rawViewNormal = normalMatrix * vLocalNormal;
    vViewNormal = length(rawViewNormal) > 1e-6 ? normalize(rawViewNormal) : vec3(0.0, 0.0, 1.0);
    vNormCol0 = normalMatrix[0];
    vNormCol1 = normalMatrix[1];
    vNormCol2 = normalMatrix[2];
    gl_Position = projectionMatrix * mvPos;
  }
`;

/**
 * Analytical Ray-Refracted Diamond-Cut Crystal Shader:
 * Evaluates the exact 2D Euclidean distance field to the letter's contour segments at both
 * the front crystal surface (p_front) and the Snell-refracted back crystal wall (p_back):
 * - Wide 42° polished diamond-cut chamfer facets (d1 < 0.132, ~33% of stroke width!)
 * - Crisp 45° corner miter ridges where non-collinear edges meet (d1 ≈ d2)
 * - Razor-sharp inset inner bevel ridge line (d1 ≈ 0.132) framing the clear inner table
 * - Parallax-shifted internal back-wall chamfer & ridge refraction (d1_back, d2_back)
 * - Sweeping diagonal studio softbox sheen + royal-sapphire total internal reflection
 */
const CRYSTAL_JEWEL_FRAGMENT = /* glsl */ `
  #define MAX_SEGS 72

  uniform vec4 uSegments[MAX_SEGS];
  uniform int uSegCount;
  uniform vec3 uDeepColor;
  uniform vec3 uMidColor;
  uniform vec3 uIceColor;

  varying vec3 vLocalPos;
  varying vec3 vLocalNormal;
  varying vec3 vViewNormal;
  varying vec3 vViewPos;
  varying vec3 vNormCol0;
  varying vec3 vNormCol1;
  varying vec3 vNormCol2;

  // Safe Gaussian band helper (avoids pow(negative, 2.0) NaN in GLSL ES 1.00 / 3.00)
  float gaussianBand(float delta, float sigma) {
    float k = delta / sigma;
    return exp(-(k * k));
  }

  // Evaluates exact Euclidean distance d1 to the 2D glyph contour plus true corner miter
  // proximity d2 (only between genuinely orthogonal/angled edges, never curved S chords
  // or shared concave vertices) for 100% artifact-free diamond-cut crystal facets.
  vec4 evalContourSdf(vec2 p) {
    float d1 = 10.0;
    float d2 = 10.0;
    vec2 n1 = vec2(0.0, 1.0);
    float t1 = 0.5;

    for (int i = 0; i < MAX_SEGS; i++) {
      if (i >= uSegCount) break;
      vec4 seg = uSegments[i];
      vec2 a = seg.xy;
      vec2 b = seg.zw;
      vec2 ab = b - a;
      float ab2 = max(dot(ab, ab), 1e-7);
      float segLen = sqrt(ab2);
      float rawT = dot(p - a, ab) / ab2;
      float t = clamp(rawT, 0.0, 1.0);
      vec2 closest = a + ab * t;
      vec2 diff = p - closest;
      float euclidDist = length(diff);

      // Straight-skeleton crystal cutting rule: long straight stems/arms (V and H have
      // segLen 0.34..1.90, whereas curved S chords are <= 0.215) penalize longitudinal
      // overshoot past reflex endpoints so bevels meet at sharp miter points without rings.
      float overshoot = max(0.0, max(-rawT, rawT - 1.0)) * segLen;
      float isStraightEdge = smoothstep(0.24, 0.30, segLen);
      float dist = euclidDist + overshoot * isStraightEdge * 1.85;

      // Orient point-to-edge radial vector consistently inward before blending on curved S
      vec2 segInward = vec2(-ab.y, ab.x) / segLen;
      vec2 radial = euclidDist > 1e-4 ? diff / euclidDist : segInward;
      vec2 orientedRadial = dot(radial, segInward) >= 0.0 ? radial : -radial;
      vec2 smoothInward = isStraightEdge < 0.5
        ? normalize(mix(segInward, orientedRadial, 0.52))
        : segInward;

      if (dist < d1) {
        // Only register a corner miter when two interior edges meet at >60 deg angle
        if (dot(segInward, n1) < 0.45 && t > 0.04 && t < 0.96 && t1 > 0.04 && t1 < 0.96) {
          d2 = d1;
        }
        d1 = dist;
        n1 = smoothInward;
        t1 = t;
      } else if (dist < d2 && dot(segInward, n1) < 0.45 && t > 0.04 && t < 0.96 && t1 > 0.04 && t1 < 0.96) {
        d2 = dist;
      }
    }

    return vec4(d1, d2, n1.x, n1.y);
  }

  void main() {
    vec3 N_geom = length(vViewNormal) > 1e-6 ? normalize(vViewNormal) : vec3(0.0, 0.0, 1.0);
    vec3 V = normalize(vViewPos);
    float faceSign = vLocalNormal.z >= 0.0 ? 1.0 : -1.0;
    float isCapFace = smoothstep(0.35, 0.75, abs(vLocalNormal.z));

    // 1. Evaluate analytical 2D contour SDF on the front crystal surface
    vec4 sdfFront = evalContourSdf(vLocalPos.xy);
    float d1 = sdfFront.x;
    float d2 = sdfFront.y;
    vec2 inward = sdfFront.zw;

    // Wide 42-degree diamond-cut chamfer zone: d1 in [0.0, 0.126] (~32% of stroke width)
    float chamferWidth = 0.126;
    float inChamfer = 1.0 - smoothstep(chamferWidth - 0.010, chamferWidth + 0.010, d1);
    float outerLip = 1.0 - smoothstep(0.0, 0.032, d1);

    // Razor-sharp inset inner bevel ridge where the 42-deg chamfer meets the flat inner table
    float innerRidge = gaussianBand(d1 - chamferWidth, 0.0095) * isCapFace;
    // Dark sapphire refraction shadow line immediately inside the inner ridge
    float innerShadowLine = gaussianBand(d1 - (chamferWidth - 0.014), 0.012) * isCapFace;

    // 45-degree corner miter crease at outer corners of V and H
    float miterDiff = abs(d1 - d2);
    float cornerMiter = smoothstep(0.020, 0.0, miterDiff) * smoothstep(chamferWidth, 0.015, d1) * isCapFace;

    // Construct smooth analytical 3D facet normal for the wide 42-deg crystal chamfer
    vec3 localChamferNormal = normalize(vec3(-inward.x * 0.70, -inward.y * 0.70, 0.71 * faceSign));
    vec3 rawChamferView = vNormCol0 * localChamferNormal.x +
                          vNormCol1 * localChamferNormal.y +
                          vNormCol2 * localChamferNormal.z;
    vec3 viewChamferNormal = length(rawChamferView) > 1e-6 ? normalize(rawChamferView) : N_geom;
    vec3 N = normalize(mix(N_geom, viewChamferNormal, inChamfer * isCapFace * 0.90));

    // 2. Refract view ray through the crystal thickness to the back crystal wall
    vec3 R_view = refract(-V, N, 1.0 / 1.54);
    vec2 parallaxShift = (R_view.xy - V.xy * 0.36) * 0.24;
    vec4 sdfBack = evalContourSdf(vLocalPos.xy + parallaxShift);
    float d1Back = sdfBack.x;
    vec2 inwardBack = sdfBack.zw;

    // Refracted back-wall inner bevel ridge & back-wall chamfer visible through the clear front table
    float backInnerRidge = gaussianBand(d1Back - chamferWidth, 0.013) * (1.0 - inChamfer * 0.65);
    float backChamferBand = smoothstep(chamferWidth + 0.008, 0.018, d1Back) * (1.0 - inChamfer * 0.55);

    // 3. Studio Lighting & Total Internal Reflection (matching reference cut-crystal optics)
    float ndotv = clamp(abs(dot(N, V)), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 1.85);

    vec3 L_key = normalize(vec3(0.42, 0.74, 0.52));
    vec3 L_rim = normalize(vec3(-0.70, 0.44, 0.56));
    vec3 L_low = normalize(vec3(0.18, -0.84, 0.51));

    vec3 H_key = normalize(L_key + V);
    vec3 H_rim = normalize(L_rim + V);
    vec3 H_low = normalize(L_low + V);

    // Crisp facet reflection sheets on the 42-deg chamfers + pinpoint diamond highlights
    float chamferLightKey = smoothstep(0.28, 0.84, max(dot(N, L_key), 0.0)) * inChamfer;
    float chamferLightRim = smoothstep(0.32, 0.86, max(dot(N, L_rim), 0.0)) * inChamfer;
    float chamferDarkTIR = smoothstep(-0.15, 0.52, -dot(N, L_key)) * inChamfer;

    float specSharp = pow(max(dot(N, H_key), 0.0), 68.0) * 1.85 +
                      pow(max(dot(N, H_rim), 0.0), 54.0) * 1.40 +
                      pow(max(dot(N, H_low), 0.0), 46.0) * 0.85;

    // Glossy diagonal studio softbox reflection sweeping across the flat central crystal table
    float diagCoord = vLocalPos.x * 0.52 + vLocalPos.y * 0.82 - V.x * 0.35;
    float tableSoftbox = (smoothstep(-0.28, 0.22, diagCoord) * (1.0 - smoothstep(0.32, 0.78, diagCoord))) *
                         (1.0 - inChamfer) * isCapFace;
    float tableStreak = gaussianBand(diagCoord - 0.18, 0.085) * (1.0 - inChamfer) * isCapFace;

    // Subtle deep-sapphire internal caustic gradient at top & bottom crystal terminals
    float terminalCaustic = smoothstep(0.52, 0.94, abs(vLocalPos.y)) * (1.0 - inChamfer * 0.4) * isCapFace;
    float backLit = clamp(dot(inwardBack, normalize(vec2(0.55, 0.75))) * 0.5 + 0.5, 0.0, 1.0);

    // 4. Composite the Cut-Crystal Optical Layers:
    float deepWeight = clamp(
      outerLip * 0.72 +
      chamferDarkTIR * 0.94 +
      inChamfer * 0.52 +
      innerShadowLine * 0.82 +
      backChamferBand * (1.0 - backLit * 0.5) * 0.78 +
      terminalCaustic * 0.45 +
      smoothstep(0.14, 0.58, fresnel) * 0.85,
      0.0,
      1.0
    );

    float midWeight = clamp(
      chamferLightRim * 0.82 +
      backChamferBand * backLit * 0.74 +
      backInnerRidge * 0.72 +
      innerRidge * 0.62 +
      terminalCaustic * 0.38,
      0.0,
      1.0
    );

    float iceWeight = clamp(
      chamferLightKey * 0.90 +
      innerRidge * 0.92 +
      backInnerRidge * 0.64 +
      cornerMiter * 0.88 +
      tableSoftbox * 0.48,
      0.0,
      1.0
    );

    float diamondWhite = clamp(
      specSharp +
      outerLip * clamp(dot(N, L_key) + 0.35, 0.0, 1.0) * 0.85 +
      innerRidge * 0.82 +
      cornerMiter * 0.85 +
      tableStreak * 0.52 +
      smoothstep(0.60, 0.94, fresnel) * 0.90,
      0.0,
      1.0
    );

    vec3 col = mix(uMidColor, uDeepColor, deepWeight);
    col = mix(col, uIceColor, iceWeight * 0.82);
    col = mix(col, vec3(1.68, 1.75, 1.85), diamondWhite);

    float alpha = clamp(
      outerLip * 0.78 +
      inChamfer * 0.72 +
      chamferDarkTIR * 0.25 +
      chamferLightKey * 0.28 +
      innerRidge * 0.86 +
      innerShadowLine * 0.55 +
      cornerMiter * 0.82 +
      backChamferBand * 0.52 +
      backInnerRidge * 0.65 +
      terminalCaustic * 0.32 +
      tableSoftbox * 0.26 +
      tableStreak * 0.42 +
      fresnel * 0.82 +
      specSharp * 0.94,
      0.0,
      0.96
    );

    gl_FragColor = vec4(col, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/**
 * Full-hero Three.js WebGL PBR + Analytical Ray-Refracted Cut-Crystal scene:
 * - Renders `/images/hero-backdrop.jpg` inside the 3D scene so `transmission: 1.0`
 *   physically refracts the fluted studio light rays through the water-clear crystal body.
 * - Evaluates the exact 2D contour SDF per glyph in GLSL to render wide 42° diamond-cut
 *   chamfer facets (~33% stroke width), 45° corner miter lines, a razor-sharp inset inner
 *   bevel ridge, parallax-shifted back-wall bevel refraction, and starburst prism floor caustics.
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

    // Pass 1 (Water-Clear Cut Crystal Body): pure optical crystal with real backdrop
    // transmission, high-index refraction, and prismatic diamond dispersion!
    const outerCrystalMaterial = new THREE.MeshPhysicalMaterial({
      color: COOL_TINT.clone(),
      transmission: 1.0,
      opacity: 1,
      transparent: false,
      thickness: 2.1,
      ior: 1.56,
      dispersion: 8.0,
      roughness: 0.01,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      specularIntensity: 2.0,
      specularColor: new THREE.Color('#ffffff'),
      attenuationColor: COOL_ATTENUATION.clone(),
      attenuationDistance: 8.5,
      iridescence: 0.38,
      iridescenceIOR: 1.48,
      iridescenceThicknessRange: [140, 380],
      envMapIntensity: 3.6,
      side: THREE.FrontSide,
    });

    const vshAnchor = new THREE.Group();
    const vshGroup = new THREE.Group();
    vshAnchor.add(vshGroup);
    scene.add(vshAnchor);

    // Starburst prismatic floor caustics beneath the 4 crystal feet of V, S, H
    const causticTexture = buildCausticFloorTexture();
    const causticGeo = new THREE.PlaneGeometry(5.6, 1.6);
    const causticMat = new THREE.MeshBasicMaterial({
      map: causticTexture,
      color: COOL_CAUSTIC_TINT.clone(),
      transparent: true,
      opacity: causticTexture ? 0.62 : 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const causticMesh = new THREE.Mesh(causticGeo, causticMat);
    causticMesh.position.set(0.05, -1.03, -0.05);
    vshGroup.add(causticMesh);

    const geometries: THREE.BufferGeometry[] = [];
    const jewelMaterials: THREE.ShaderMaterial[] = [];
    const sharedDeepColor = COOL_RIM_DEEP.clone();
    const sharedMidColor = COOL_RIM_MID.clone();
    const sharedIceColor = COOL_ICE_GLOW.clone();

    const glyphEntries: {
      holder: THREE.Group;
      spec: GlyphContourSpec;
      phase: number;
      dir: number;
    }[] = [];

    VSH_FOUNDRY_GLYPHS.forEach((spec, idx) => {
      const shape = buildShapeFromTrueType(spec.pts);
      const { segments, count } = extractContourSegments(shape);

      // Wide 42-deg diamond-cut crystal chamfer profile with crisp inset inner bevel ridge
      const rawGeo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.34,
        curveSegments: 24,
        bevelEnabled: true,
        bevelThickness: 0.14,
        bevelSize: 0.088,
        bevelOffset: -0.072,
        bevelSegments: 4,
      });
      rawGeo.translate(0, 0, -0.17);
      rawGeo.deleteAttribute('normal');
      rawGeo.deleteAttribute('uv');
      const weldedGeo = mergeVertices(rawGeo, 1e-4);
      rawGeo.dispose();
      // Preserve crisp jewel-cut crease along the inner bevel ridge and corner miters
      const crystalGeo = toCreasedNormals(
        weldedGeo,
        THREE.MathUtils.degToRad(26),
      );
      weldedGeo.dispose();
      geometries.push(crystalGeo);

      // Pass 2 (Per-Glyph Analytical Ray-Refracted Cut-Crystal Shader)
      const jewelMat = new THREE.ShaderMaterial({
        uniforms: {
          uSegments: { value: segments },
          uSegCount: { value: count },
          uDeepColor: { value: sharedDeepColor },
          uMidColor: { value: sharedMidColor },
          uIceColor: { value: sharedIceColor },
        },
        vertexShader: CRYSTAL_JEWEL_VERTEX,
        fragmentShader: CRYSTAL_JEWEL_FRAGMENT,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
        side: THREE.FrontSide,
      });
      jewelMaterials.push(jewelMat);

      const holder = new THREE.Group();
      holder.position.set(spec.centerX, 0, 0);

      const outerMesh = new THREE.Mesh(crystalGeo, outerCrystalMaterial);
      outerMesh.renderOrder = 1;
      const jewelMesh = new THREE.Mesh(crystalGeo, jewelMat);
      jewelMesh.renderOrder = 2;

      holder.add(outerMesh, jewelMesh);
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
      sharedDeepColor.copy(COOL_RIM_DEEP).lerp(ALERT_RIM_DEEP, s.alertMix);
      sharedMidColor.copy(COOL_RIM_MID).lerp(ALERT_RIM_MID, s.alertMix);
      sharedIceColor.copy(COOL_ICE_GLOW).lerp(ALERT_ICE_GLOW, s.alertMix);
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

      vshGroup.rotation.y = reducedMotion
        ? -0.18
        : Math.sin(elapsed * 0.6 - 0.45) * 0.34 + s.currentMouseX * 0.21;
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
      for (const mat of jewelMaterials) {
        mat.dispose();
      }
      backdropGeo.dispose();
      backdropMat.dispose();
      backdropTexture?.dispose();
      causticGeo.dispose();
      causticMat.dispose();
      causticTexture?.dispose();
      outerCrystalMaterial.dispose();
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
