import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const velvet = (color: string) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.55, sheen: 1, sheenColor: new THREE.Color('#ffffff'), sheenRoughness: 0.6 });
const satin = (color: string) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, metalness: 0.05, clearcoat: 0.6, clearcoatRoughness: 0.3 });

/** Gift box with lid, ribbon and a simple bow. */
export const GiftBox: React.FC<{ color?: string; ribbon?: string; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number; lidOpen?: number }> = ({ color = '#f6e7ee', ribbon = '#F84888', position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, lidOpen = 0 }) => {
  const box = useMemo(() => new RoundedBoxGeometry(1.6, 1.0, 1.6, 4, 0.06), []);
  const lid = useMemo(() => new RoundedBoxGeometry(1.7, 0.28, 1.7, 4, 0.06), []);
  const m = useMemo(() => velvet(color), [color]);
  const rb = useMemo(() => satin(ribbon), [ribbon]);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={box} material={m} position={[0, 0.5, 0]} castShadow receiveShadow />
      <mesh position={[0, 0.5, 0]} material={rb}><boxGeometry args={[1.62, 1.02, 0.3]} /></mesh>
      <mesh position={[0, 0.5, 0]} material={rb}><boxGeometry args={[0.3, 1.02, 1.62]} /></mesh>
      <group position={[0, 1.0, -0.85]} rotation={[-lidOpen * 1.2, 0, 0]}>
        <group position={[0, 0.14, 0.85]}>
          <mesh geometry={lid} material={m} castShadow />
          <mesh material={rb} position={[0, 0.01, 0]}><boxGeometry args={[1.72, 0.3, 0.3]} /></mesh>
          <mesh material={rb} position={[0, 0.01, 0]}><boxGeometry args={[0.3, 0.3, 1.72]} /></mesh>
          {/* bow loops */}
          <mesh material={rb} position={[-0.28, 0.3, 0]} rotation={[0, 0, 0.5]}><torusGeometry args={[0.22, 0.07, 10, 24]} /></mesh>
          <mesh material={rb} position={[0.28, 0.3, 0]} rotation={[0, 0, -0.5]}><torusGeometry args={[0.22, 0.07, 10, 24]} /></mesh>
          <mesh material={rb} position={[0, 0.28, 0]}><sphereGeometry args={[0.1, 12, 10]} /></mesh>
        </group>
      </group>
    </group>
  );
};

/** Chocolate bar in foil + paper sleeve. */
export const Chocolate: React.FC<{ position?: [number, number, number]; rotation?: [number, number, number]; scale?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const choc = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#4a2412', roughness: 0.35, clearcoat: 0.5, clearcoatRoughness: 0.25 }), []);
  const sleeve = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#7850F0', roughness: 0.5, sheen: 0.6 }), []);
  const foil = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d9c38a', metalness: 0.9, roughness: 0.3 }), []);
  const seg = useMemo(() => new RoundedBoxGeometry(0.42, 0.16, 0.42, 3, 0.04), []);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.06, 0]} material={choc}><boxGeometry args={[2.0, 0.12, 1.1]} /></mesh>
      {Array.from({ length: 4 }).map((_, i) => Array.from({ length: 2 }).map((__, j) => <mesh key={`${i}${j}`} geometry={seg} material={choc} position={[-0.72 + i * 0.48, 0.18, -0.26 + j * 0.52]} />))}
      <mesh position={[0, 0.12, 0.55]} material={foil}><boxGeometry args={[2.02, 0.3, 0.02]} /></mesh>
      <mesh position={[-0.55, 0.14, 0]} material={sleeve}><boxGeometry args={[0.9, 0.36, 1.14]} /></mesh>
    </group>
  );
};

/** Soft teddy bear made of spheres (stylised, friendly). */
export const Teddy: React.FC<{ position?: [number, number, number]; rotation?: [number, number, number]; scale?: number; color?: string }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color = '#c9956b' }) => {
  const fur = useMemo(() => new THREE.MeshPhysicalMaterial({ color, roughness: 0.95, sheen: 0.9, sheenRoughness: 0.9, sheenColor: new THREE.Color('#fff0e0') }), [color]);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2b1a12', roughness: 0.5 }), []);
  const muzzle = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#e8c9a8', roughness: 0.9, sheen: 0.6 }), []);
  const S = (args: [number, number, number], pos: [number, number, number], m: THREE.Material = fur, sc: [number, number, number] = [1, 1, 1]) => <mesh position={pos} scale={sc} material={m}><sphereGeometry args={args} /></mesh>;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {S([0.7, 24, 18], [0, 0.7, 0], fur, [1, 1.1, 0.9])}
      {S([0.52, 24, 18], [0, 1.65, 0])}
      {S([0.2, 16, 12], [-0.42, 2.05, 0])}{S([0.2, 16, 12], [0.42, 2.05, 0])}
      {S([0.11, 12, 10], [-0.42, 2.05, 0.12], muzzle)}{S([0.11, 12, 10], [0.42, 2.05, 0.12], muzzle)}
      {S([0.26, 16, 12], [0, 1.5, 0.4], muzzle, [1.1, 0.8, 0.8])}
      {S([0.08, 12, 10], [0, 1.6, 0.62], dark)}
      {S([0.055, 10, 8], [-0.18, 1.78, 0.44], dark)}{S([0.055, 10, 8], [0.18, 1.78, 0.44], dark)}
      {S([0.24, 16, 12], [-0.62, 0.95, 0.15], fur, [1, 1.6, 1])}{S([0.24, 16, 12], [0.62, 0.95, 0.15], fur, [1, 1.6, 1])}
      {S([0.28, 16, 12], [-0.4, 0.1, 0.35], fur, [1, 0.8, 1.3])}{S([0.28, 16, 12], [0.4, 0.1, 0.35], fur, [1, 0.8, 1.3])}
      {/* bow */}
      <mesh position={[0, 1.2, 0.45]} rotation={[0.2, 0, 0.5]}><torusGeometry args={[0.12, 0.045, 8, 16]} /><meshPhysicalMaterial color="#F84888" roughness={0.4} /></mesh>
      <mesh position={[0.2, 1.2, 0.45]} rotation={[0.2, 0, -0.5]}><torusGeometry args={[0.12, 0.045, 8, 16]} /><meshPhysicalMaterial color="#F84888" roughness={0.4} /></mesh>
    </group>
  );
};

/** Heart pendant on a chain inside an open jewellery box. */
export const Pendant: React.FC<{ position?: [number, number, number]; rotation?: [number, number, number]; scale?: number }> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const gold = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e9c46a', metalness: 1, roughness: 0.18 }), []);
  const gem = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#ff5c8a', roughness: 0.05, transmission: 0.6, thickness: 0.6, ior: 1.8, clearcoat: 1 }), []);
  const heart = useMemo(() => {
    const sh = new THREE.Shape();
    sh.moveTo(0, -0.5); sh.bezierCurveTo(-0.9, 0.2, -0.5, 0.9, 0, 0.45); sh.bezierCurveTo(0.5, 0.9, 0.9, 0.2, 0, -0.5);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4, curveSegments: 24 });
    g.center();
    return g;
  }, []);
  const boxMat = useMemo(() => velvet('#2a0f2b'), []);
  const box = useMemo(() => new RoundedBoxGeometry(1.5, 0.5, 1.3, 4, 0.08), []);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={box} material={boxMat} position={[0, 0.25, 0]} />
      <mesh geometry={box} material={boxMat} position={[0, 0.78, -0.95]} rotation={[-1.9, 0, 0]} />
      <mesh position={[0, 0.5, 0]} material={new THREE.MeshPhysicalMaterial({ color: '#f3dde4', roughness: 0.9, sheen: 1 })}><boxGeometry args={[1.3, 0.02, 1.1]} /></mesh>
      <mesh geometry={heart} material={gem} position={[0, 0.72, 0.05]} rotation={[-1.3, 0, 0]} scale={0.42} />
      <mesh material={gold} position={[0, 0.72, 0.05]} rotation={[-1.3, 0, 0]} scale={0.46}><torusGeometry args={[0.52, 0.03, 8, 40]} /></mesh>
      {Array.from({ length: 16 }).map((_, i) => <mesh key={i} material={gold} position={[Math.cos(i / 16 * Math.PI * 2) * 0.5, 0.53, Math.sin(i / 16 * Math.PI * 2) * 0.42]}><torusGeometry args={[0.035, 0.012, 6, 10]} /></mesh>)}
    </group>
  );
};
