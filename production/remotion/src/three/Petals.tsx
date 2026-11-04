import React, { useMemo } from 'react';
import * as THREE from 'three';
import { makePetalGeometry, mulberry } from './Rose';

/** Falling / floating petals (instanced). `t` in seconds drives motion deterministically. */
export const PetalRain: React.FC<{ t: number; count?: number; seed?: number; area?: [number, number, number]; speed?: number; tint?: string; scale?: number; swirl?: number }> = ({ t, count = 120, seed = 7, area = [9, 12, 6], speed = 1, tint = '#e3366f', scale = 0.22, swirl = 0 }) => {
  const geo = useMemo(() => makePetalGeometry(0.6, 10), []);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: tint, vertexColors: true, roughness: 0.5, sheen: 0.8, sheenColor: new THREE.Color('#ffc2d6'), side: THREE.DoubleSide }), [tint]);
  const items = useMemo(() => {
    const r = mulberry(seed);
    return Array.from({ length: count }, () => ({ x: (r() - 0.5) * area[0], y0: r() * area[1], z: (r() - 0.5) * area[2], fall: 0.5 + r() * 0.9, sway: 0.4 + r() * 0.9, phase: r() * 6.28, rx: r() * 6.28, ry: r() * 6.28, rz: r() * 6.28, spin: (r() - 0.5) * 2.4, s: 0.6 + r() * 0.9 }));
  }, [count, seed, area]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const ref = React.useRef<THREE.InstancedMesh>(null);
  React.useLayoutEffect(() => {
    const m = ref.current; if (!m) return;
    items.forEach((p, i) => {
      const y = ((p.y0 - t * p.fall * speed) % area[1] + area[1]) % area[1] - area[1] / 2;
      const sw = Math.sin(t * p.sway + p.phase) * 0.6;
      const ang = swirl ? t * 0.4 + p.phase : 0;
      const x = swirl ? Math.cos(ang) * (2 + p.x * 0.4) : p.x + sw;
      const z = swirl ? Math.sin(ang) * (2 + p.x * 0.4) : p.z + Math.cos(t * p.sway * 0.7 + p.phase) * 0.4;
      dummy.position.set(x, y, z);
      dummy.rotation.set(p.rx + t * p.spin, p.ry + t * p.spin * 0.6, p.rz + sw);
      dummy.scale.setScalar(scale * p.s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [t, items, dummy, area, speed, scale, swirl]);
  return <instancedMesh ref={ref} args={[geo, mat, count]} castShadow />;
};

/** Floating light particles (additive points). */
export const Sparkles: React.FC<{ t: number; count?: number; seed?: number; area?: [number, number, number]; size?: number; color?: string; opacity?: number }> = ({ t, count = 400, seed = 11, area = [10, 14, 8], size = 0.08, color = '#ffd6e8', opacity = 0.9 }) => {
  const { geo, speeds } = useMemo(() => {
    const r = mulberry(seed);
    const pos = new Float32Array(count * 3); const sp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { pos[i * 3] = (r() - 0.5) * area[0]; pos[i * 3 + 1] = (r() - 0.5) * area[1]; pos[i * 3 + 2] = (r() - 0.5) * area[2]; sp[i * 3] = r() * 6.28; sp[i * 3 + 1] = 0.2 + r() * 0.6; sp[i * 3 + 2] = r(); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return { geo: g, speeds: sp };
  }, [count, seed, area]);
  const mat = useMemo(() => new THREE.PointsMaterial({ color, size, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, map: sparkTexture() }), [color, size, opacity]);
  const ref = React.useRef<THREE.Points>(null);
  React.useLayoutEffect(() => {
    const p = ref.current; if (!p) return;
    const a = p.geometry.attributes.position as THREE.BufferAttribute;
    const base = (geo.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < count; i++) {
      a.setXYZ(i, base[i * 3] + Math.sin(t * speeds[i * 3 + 1] + speeds[i * 3]) * 0.3, ((base[i * 3 + 1] + t * speeds[i * 3 + 1] * 0.35 + area[1] / 2) % area[1]) - area[1] / 2, base[i * 3 + 2] + Math.cos(t * speeds[i * 3 + 1] * 0.8 + speeds[i * 3]) * 0.3);
    }
    a.needsUpdate = true;
  }, [t, count, speeds, geo, area]);
  return <points ref={ref} geometry={geo.clone()} material={mat} />;
};

let _spark: THREE.Texture | null = null;
function sparkTexture() {
  if (_spark) return _spark;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,0.6)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  _spark = new THREE.CanvasTexture(c);
  return _spark;
}
