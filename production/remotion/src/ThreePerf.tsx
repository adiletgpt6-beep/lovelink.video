import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';

const petalGeo = (() => {
  const fn = (u: number, v: number, t: THREE.Vector3) => {
    // u along petal length (0 base -> 1 tip), v across width
    const w = Math.sin(u * Math.PI) * 0.6 * (0.3 + 0.7 * u);
    const x = (v - 0.5) * 2 * w;
    const y = u * 1.4;
    const z = -Math.pow(u, 2) * 0.9 + Math.pow(x, 2) * 0.35 - (1 - u) * 0.1;
    t.set(x, y, z);
  };
  return new ParametricGeometry(fn, 24, 24);
})();

export const ThreePerf: React.FC<{ petals: number; shadows: boolean; transparent?: boolean }> = ({ petals, shadows, transparent = false }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#e0245e', roughness: 0.55, sheen: 1, sheenColor: new THREE.Color('#ff9bb8'), side: THREE.DoubleSide }), []);
  const items = useMemo(() => Array.from({ length: petals }, (_, i) => ({ ring: Math.floor(i / 8), k: i % 8 })), [petals]);
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ background: transparent ? 'transparent' : '#0a0612' }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 2.2, 5.5], fov: 40 }} gl={{ antialias: true, alpha: transparent }} shadows={shadows} style={{ width, height }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 6, 4]} intensity={2.2} castShadow={shadows} />
        <pointLight position={[-3, 2, 2]} intensity={6} color="#ff6fa0" />
        <group rotation={[0, t * 0.6, 0]}>
          {items.map(({ ring, k }, i) => {
            const open = Math.min(1, t / 3) * (0.25 + ring * 0.22);
            return (
              <mesh key={i} geometry={petalGeo} material={mat} castShadow={shadows} receiveShadow={shadows} rotation={[open * 1.1, (k / 8) * Math.PI * 2 + ring * 0.35, 0]} scale={0.6 + ring * 0.25} />
            );
          })}
        </group>
        {!transparent && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow={shadows}><planeGeometry args={[20, 20]} /><meshStandardMaterial color="#120a1a" /></mesh>}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
