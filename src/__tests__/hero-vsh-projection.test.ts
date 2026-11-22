import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  buildShapeFromTrueType,
  computeVshFitScale,
  computeVshFitScaleForStage,
  extractContourSegments,
  MAX_SDF_SEGMENTS,
  VSH_PROJECTION_BOUNDS,
} from '@/components/landing/HeroCanvasScene';
import { VSH_FOUNDRY_GLYPHS } from '@/components/landing/vsh-glyph-paths';

describe('HeroCanvasScene 3D perspective projection fitting', () => {
  const viewports = [
    { name: 'mobile-320', width: 280, height: 220 },
    { name: 'mobile-390', width: 350, height: 220 },
    { name: 'sm-tablet', width: 620, height: 265 },
    { name: 'xl-laptop', width: 630, height: 300 },
    { name: '2xl-desktop', width: 780, height: 325 },
  ] as const;

  it.each(viewports)(
    'keeps all 8 rotated/drifted VSH bounding-box corners strictly inside stage NDC [-1, 1] for $name ($widthx$height)',
    ({ width, height }) => {
      const aspect = width / height;
      const { halfW, halfH, halfD, maxRx, maxRy, maxPosX, maxPosY, cameraFov, cameraZ } =
        VSH_PROJECTION_BOUNDS;

      const stageWorldH =
        2 * cameraZ * Math.tan(THREE.MathUtils.degToRad(cameraFov * 0.5));
      const stageWorldW = stageWorldH * aspect;
      const scale = computeVshFitScaleForStage(stageWorldW, stageWorldH, cameraZ);
      expect(scale).toBeCloseTo(computeVshFitScale(aspect, cameraFov, cameraZ), 6);
      expect(scale).toBeGreaterThan(0.1);

      const camera = new THREE.PerspectiveCamera(cameraFov, aspect, 0.1, 100);
      camera.position.set(0, 0, cameraZ);
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();
      camera.updateProjectionMatrix();

      const corners: THREE.Vector3[] = [];
      for (const sx of [-1, 1]) {
        for (const sy of [-1, 1]) {
          for (const sz of [-1, 1]) {
            corners.push(new THREE.Vector3(sx * halfW, sy * halfH, sz * halfD));
          }
        }
      }

      const yawSamples = [-maxRy, -maxRy * 0.5, 0, maxRy * 0.5, maxRy];
      const pitchSamples = [-maxRx, 0, maxRx];
      const shiftXSamples = [-maxPosX, 0, maxPosX];
      const shiftYSamples = [-maxPosY, 0, maxPosY];

      let worstAbsX = 0;
      let worstAbsY = 0;

      for (const ry of yawSamples) {
        for (const rx of pitchSamples) {
          const euler = new THREE.Euler(rx, ry, 0, 'XYZ');
          for (const px of shiftXSamples) {
            for (const py of shiftYSamples) {
              for (const corner of corners) {
                const worldPt = corner
                  .clone()
                  .multiplyScalar(scale)
                  .applyEuler(euler)
                  .add(new THREE.Vector3(px, py, 0));
                const ndc = worldPt.project(camera);
                worstAbsX = Math.max(worstAbsX, Math.abs(ndc.x));
                worstAbsY = Math.max(worstAbsY, Math.abs(ndc.y));
              }
            }
          }
        }
      }

      expect(worstAbsX).toBeLessThanOrEqual(1.0);
      expect(worstAbsY).toBeLessThanOrEqual(1.0);
    },
  );

  it('extracts valid non-degenerate 2D SDF contour segments for V, S, and H within shader uniform limits', () => {
    for (const glyph of VSH_FOUNDRY_GLYPHS) {
      const shape = buildShapeFromTrueType(glyph.pts);
      const { segments, count } = extractContourSegments(shape);
      expect(count).toBeGreaterThanOrEqual(12);
      expect(count).toBeLessThanOrEqual(MAX_SDF_SEGMENTS);
      expect(segments).toHaveLength(MAX_SDF_SEGMENTS);

      for (let i = 0; i < count; i++) {
        const seg = segments[i];
        const len = Math.hypot(seg.z - seg.x, seg.w - seg.y);
        expect(Number.isFinite(len)).toBe(true);
        expect(len).toBeGreaterThan(1e-4);
      }
    }
  });
});
