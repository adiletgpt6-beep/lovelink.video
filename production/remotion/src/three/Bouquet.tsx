import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Rose, makeLeafGeometry, leafMaterial, mulberry } from './Rose';

type Props = { bloom?: number; /** 0 = roses scattered in the air, 1 = assembled */ assemble?: number; roses?: number; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number; tints?: string[]; wrap?: 'kraft' | 'blush' | 'none'; seed?: number };

/** A hand-tied bouquet: roses on a cone, leaves between, wrapping paper + ribbon. */
export const Bouquet: React.FC<Props> = ({ bloom = 1, assemble = 1, roses = 7, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, tints = ['#c81d4e', '#d8336b', '#b91544', '#e04e7e'], wrap = 'blush', seed = 3 }) => {
  const layout = useMemo(() => {
    const r = mulberry(seed);
    return Array.from({ length: roses }, (_, i) => {
      const ring = i === 0 ? 0 : 1;
      const a = i === 0 ? 0 : ((i - 1) / (roses - 1)) * Math.PI * 2 + r() * 0.3;
      const rad = ring === 0 ? 0 : 0.75 + r() * 0.15;
      const dx = (r() - 0.5) * 9, dy = 3 + r() * 5, dz = (r() - 0.5) * 6;
      return { x: Math.cos(a) * rad, z: Math.sin(a) * rad, y: ring === 0 ? 0.35 : 0.05 + r() * 0.15, tilt: ring === 0 ? 0 : 0.38 + r() * 0.1, a, tint: tints[i % tints.length], s: 0.55 + r() * 0.08, seed: i + 1, dx, dy, dz, spin: (r() - 0.5) * 4 };
    });
  }, [roses, seed, tints]);
  const leafGeo = useMemo(() => makeLeafGeometry(), []);
  const leafMat = useMemo(() => leafMaterial(), []);
  const paper = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 24; i++) { const t = i / 24; const rr = 0.25 + Math.pow(t, 0.75) * 1.55 + Math.sin(t * 18) * 0.02 * t; pts.push(new THREE.Vector2(rr, -2.6 + t * 2.9)); }
    const g = new THREE.LatheGeometry(pts, 48);
    g.computeVertexNormals();
    return g;
  }, []);
  const paperMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: wrap === 'kraft' ? '#c99a6b' : '#f9dbe4', roughness: 0.75, sheen: 0.4, sheenColor: new THREE.Color('#fff'), side: THREE.DoubleSide, transparent: true, opacity: 0.96 }), [wrap]);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {layout.map((p, i) => {
        const e = 1 - Math.pow(1 - Math.max(0, Math.min(1, assemble)), 3);
        const u = 1 - e;
        return (
          <group key={i} position={[p.x + p.dx * u, p.y + p.dy * u, p.z + p.dz * u]} rotation={[Math.sin(p.a) * p.tilt + p.spin * u, p.spin * 0.5 * u, -Math.cos(p.a) * p.tilt + p.spin * u]}>
            <Rose bloom={bloom} scale={p.s} tint={p.tint} seed={p.seed} petals={40} />
          </group>
        );
      })}
      {Array.from({ length: 9 }).map((_, j) => {
        const a = (j / 9) * Math.PI * 2 + 0.2;
        return (
          <group key={`leaf${j}`} position={[Math.cos(a) * 1.05, -0.35, Math.sin(a) * 1.05]} rotation={[0, -a + Math.PI / 2, 0]}>
            <mesh geometry={leafGeo} material={leafMat} rotation={[0.9, 0, 0]} scale={0.9} />
          </group>
        );
      })}
      {wrap !== 'none' && <mesh geometry={paper} material={paperMat} position={[0, -3 * (1 - Math.min(1, assemble * 1.3)), 0]} scale={[1, 1, 1]} />}
      {wrap !== 'none' && <mesh position={[0, -1.35, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.72, 0.07, 10, 48]} /><meshPhysicalMaterial color="#F84888" roughness={0.35} sheen={1} sheenColor={new THREE.Color('#fff')} /></mesh>}
      {/* stems below the wrap */}
      {Array.from({ length: 7 }).map((_, j) => (
        <mesh key={`st${j}`} position={[Math.cos(j * 0.9) * 0.1, -2.9, Math.sin(j * 0.9) * 0.1]} rotation={[0, 0, Math.cos(j) * 0.05]}><cylinderGeometry args={[0.03, 0.03, 1.1, 8]} /><meshStandardMaterial color="#3b7a43" roughness={0.7} /></mesh>
      ))}
    </group>
  );
};
