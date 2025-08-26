import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Tesseract4D({ breathPhase }) {
  const groupRef = useRef();
  const d = 4;

  const vertices4D = useMemo(() => [
    [-1, -1, -1, -1], [-1, -1, -1, 1], [-1, -1, 1, -1], [-1, -1, 1, 1],
    [-1, 1, -1, -1], [-1, 1, -1, 1], [-1, 1, 1, -1], [-1, 1, 1, 1],
    [1, -1, -1, -1], [1, -1, -1, 1], [1, -1, 1, -1], [1, -1, 1, 1],
    [1, 1, -1, -1], [1, 1, -1, 1], [1, 1, 1, -1], [1, 1, 1, 1]
  ], []);

  const edges = useMemo(() => {
    const e = [];
    for (let i = 0; i < vertices4D.length; i++) {
      for (let j = i + 1; j < vertices4D.length; j++) {
        const diff = vertices4D[i].filter((val, k) => val !== vertices4D[j][k]);
        if (diff.length === 2) e.push([i, j]);
      }
    }
    return e;
  }, [vertices4D]);

  const positions = useMemo(() => new Float32Array(edges.length * 2 * 3), [edges.length]);
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  const material = new THREE.LineBasicMaterial({ color: 0x33ffff });

  useFrame(({ clock }) => {
    const angle = 0.01 + 0.01 * Math.sin(breathPhase * 2 * Math.PI);
    const v4 = vertices4D.map(([w, x, y, z]) => {
      // 4D rotation in W–X and Y–Z planes
      const wx = x * Math.cos(angle) - w * Math.sin(angle);
      const ww = x * Math.sin(angle) + w * Math.cos(angle);
      const yz = z * Math.cos(angle) - y * Math.sin(angle);
      const yy = z * Math.sin(angle) + y * Math.cos(angle);
      return [ww, wx, yy, yz];
    });

    const projected = v4.map(([w, x, y, z]) => {
      const factor = d / (d - w);
      return new THREE.Vector3(x * factor, y * factor, z * factor);
    });

    edges.forEach(([i, j], idx) => {
      const vi = projected[i];
      const vj = projected[j];
      const li = 6 * idx;
      positions[li] = vi.x;
      positions[li + 1] = vi.y;
      positions[li + 2] = vi.z;
      positions[li + 3] = vj.x;
      positions[li + 4] = vj.y;
      positions[li + 5] = vj.z;
    });

    geometry.attributes.position.needsUpdate = true;
    groupRef.current.rotation.y += 0.002;
  });

  return <lineSegments ref={groupRef} geometry={geometry} material={material} position={[-1.5, 1, 0]} />;
}