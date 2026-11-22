import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import {
  computeVshFitScale,
  VSH_PROJECTION_BOUNDS,
} from '@/components/landing/HeroCanvasScene';

describe('HeroCanvasScene 3D perspective projection fitting', () => {
  const viewports = [
    { name: 'mobile-320', width: 280, height: 160 },
    { name: 'mobile-390', width: 350, height: 160 },
    { name: 'sm-tablet', width: 540, height: 205 },
    { name: 'lg-xl-laptop', width: 620, height: 235 },
    { name: '2xl-desktop', width: 680, height: 255 },
  ] as const;

  it.each(viewports)(
    'keeps all 8 rotated/drifted VSH bounding-box corners strictly inside NDC [-1, 1] for $name ($widthx$height)',
    ({ width, height }) => {
      const aspect = width / height;
      const { halfW, halfH, halfD, maxRx, maxRy, maxPosX, maxPosY, cameraFov, cameraZ } =
        VSH_PROJECTION_BOUNDS;

      const scale = computeVshFitScale(aspect, cameraFov, cameraZ);
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
});
