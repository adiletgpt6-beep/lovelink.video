import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

/* ------------------------------------------------------------------ geometry */

/** One rose petal: u = base→tip, v = left→right. Broad, cupped near the base, edges and tip rolled back. */
export function makePetalGeometry(curl = 1, segs = 32) {
  const fn = (u: number, v: number, t: THREE.Vector3) => {
    const width = 0.6 * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.72)), 0.45) * (0.22 + 0.78 * Math.min(1, u * 2.4));
    const x = (v - 0.5) * 2 * width;
    const y = u * 1.0;
    const cup = Math.pow(x, 2) * (0.95 - 0.5 * u);              // cup at the base, flatter at the tip
    const edgeRoll = -Math.pow(Math.abs(x), 3) * 0.5 * (0.3 + u);  // edges curl gently backwards
    const tipRoll = -Math.pow(Math.max(0, u - 0.74), 2) * 1.0 * curl; // soft roll of the tip
    const lean = -Math.pow(u, 2) * 0.35 * curl;
    const wave = Math.sin(v * Math.PI * 4 + u * 3) * 0.012 * u;
    t.set(x, y, cup + edgeRoll + tipRoll + lean + wave);
  };
  const g = new ParametricGeometry(fn, segs, segs);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i); // 0..1 along petal
    const x = Math.abs(pos.getX(i));
    const l = 0.30 + y * 0.30 + x * 0.25;
    c.setHSL(0.975 - y * 0.015, 0.82, Math.min(0.68, l));
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

export function makeLeafGeometry(segs = 14) {
  const fn = (u: number, v: number, t: THREE.Vector3) => {
    const width = Math.pow(Math.sin(u * Math.PI), 0.9) * 0.36;
    const x = (v - 0.5) * 2 * width;
    const y = u * 1.1;
    t.set(x, y, -Math.abs(x) * 0.35 + Math.sin(u * Math.PI) * 0.08);
  };
  const g = new ParametricGeometry(fn, segs, segs);
  g.computeVertexNormals();
  return g;
}

/* ------------------------------------------------------------------ materials */

export const petalMaterial = (tint: string, emissive = 0.05) =>
  new THREE.MeshPhysicalMaterial({
    color: tint, vertexColors: true, roughness: 0.42, metalness: 0, sheen: 0.8, sheenRoughness: 0.55, envMapIntensity: 0.9,
    sheenColor: new THREE.Color('#ffb3c8'), clearcoat: 0.08, clearcoatRoughness: 0.6, side: THREE.DoubleSide,
    emissive: new THREE.Color(tint).multiplyScalar(emissive), transparent: false,
  });

export const leafMaterial = () => new THREE.MeshStandardMaterial({ color: '#2f7a46', roughness: 0.6, side: THREE.DoubleSide });
export const stemMaterial = () => new THREE.MeshStandardMaterial({ color: '#3b7a43', roughness: 0.7 });

/* ------------------------------------------------------------------ rose */

export type RoseProps = {
  /** 0 = tight bud, 1 = fully open */
  bloom: number;
  petals?: number;
  tint?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  stem?: number; // stem length (0 = none)
  seed?: number;
};

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

export const Rose: React.FC<RoseProps> = ({ bloom, petals = 45, tint = '#c81d4e', position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, stem = 0, seed = 1 }) => {
  const geo = useMemo(() => makePetalGeometry(1), []);
  const geoInner = useMemo(() => makePetalGeometry(0.25, 24), []);
  const mat = useMemo(() => petalMaterial(tint), [tint]);
  const leafGeo = useMemo(() => makeLeafGeometry(), []);
  const leafMat = useMemo(() => leafMaterial(), []);
  const stemMat = useMemo(() => stemMaterial(), []);
  const PER = 5;
  const whorls = Math.ceil(petals / PER);
  const layout = useMemo(() => {
    const r = mulberry(seed);
    return Array.from({ length: petals }, (_, i) => {
      const w = Math.floor(i / PER);
      const k = whorls > 1 ? w / (whorls - 1) : 1; // 0 centre → 1 outer whorl
      const angle = ((i % PER) / PER) * Math.PI * 2 + w * 0.63 + (r() - 0.5) * 0.18;
      return { k, w, angle, jitter: (r() - 0.5) * 0.08, scaleJ: 0.95 + r() * 0.1 };
    });
  }, [petals, seed, whorls]);
  // the stylised rose reads best between a loose bud and a three-quarter bloom
  const b = 0.18 + 0.6 * Math.max(0, Math.min(1, bloom));
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {layout.map(({ k, angle, jitter, scaleJ }, i) => {
        const open = 0.06 + Math.pow(k, 1.4) * (0.1 + 1.15 * b);   // tilt in radians
        const radius = 0.035 + Math.pow(k, 0.9) * (0.12 + 0.24 * b);
        const lift = 0.12 - k * (0.05 + 0.22 * b);
        const s = (0.46 + k * 0.36) * scaleJ * (0.85 + 0.15 * b);
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <group position={[0, lift, radius]} rotation={[open + jitter, 0, 0]}>
              <mesh geometry={k < 0.3 ? geoInner : geo} material={mat} scale={k < 0.3 ? [s * 1.05, s * 0.72, s * 1.05] : s} castShadow receiveShadow />
            </group>
          </group>
        );
      })}
      {/* centre + receptacle */}
      <mesh position={[0, 0.25, 0]} rotation={[0.1, 0, 0]}><coneGeometry args={[0.09, 0.3, 10]} /><meshStandardMaterial color="#7a0f3a" roughness={0.8} /></mesh>
      <mesh position={[0, -0.02, 0]}><sphereGeometry args={[0.2, 16, 12]} /><meshStandardMaterial color="#3f7d3f" roughness={0.9} /></mesh>
      {stem > 0 && (
        <group>
          <mesh position={[0, -stem / 2 - 0.1, 0]}><cylinderGeometry args={[0.045, 0.06, stem, 10]} /><primitive object={stemMat} attach="material" /></mesh>
          {[0, 1, 2, 3, 4].map((j) => (
            <group key={j} position={[0, -0.12, 0]} rotation={[0, (j / 5) * Math.PI * 2 + 0.6, 0]}>
              <mesh geometry={leafGeo} material={leafMat} position={[0, 0, 0.16]} rotation={[1.1 + 0.35 * b, 0, 0]} scale={0.45} />
            </group>
          ))}
          {[0, 1].map((j) => (
            <group key={`l${j}`} position={[0, -stem * (0.4 + j * 0.28), 0]} rotation={[0, j * 2.4 + 0.9, 0]}>
              <mesh geometry={leafGeo} material={leafMat} position={[0, 0, 0.08]} rotation={[1.0, 0, 0.3]} scale={0.85} />
            </group>
          ))}
        </group>
      )}
    </group>
  );
};

/** Deterministic PRNG for layouts. */
export function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ lights */

/** Image-based lighting from three's RoomEnvironment (generated once per scene). */
export const Env: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = intensity;
    return () => { scene.environment = null; env.dispose(); pmrem.dispose(); };
  }, [gl, scene, intensity]);
  return null;
};

/** Cinematic three-point rig tuned for petals (warm key, pink rim, soft fill). */
export const StudioLights: React.FC<{ intensity?: number; shadows?: boolean }> = ({ intensity = 1, shadows = false }) => (
  <>
    <ambientLight intensity={0.15 * intensity} color="#ffd9e6" />
    <directionalLight position={[3.5, 6, 4]} intensity={1.6 * intensity} color="#fff1e6" castShadow={shadows} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
    <pointLight position={[-4, 2.5, 2.5]} intensity={6 * intensity} color="#ff6fa8" distance={16} decay={2} />
    <pointLight position={[2.5, -1, -4]} intensity={5 * intensity} color="#8b6cff" distance={16} decay={2} />
    <spotLight position={[0, 7, 2]} angle={0.7} penumbra={0.9} intensity={10 * intensity} color="#fff6f0" />
  </>
);
