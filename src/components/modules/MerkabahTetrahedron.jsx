import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function MerkabahTetrahedron({ breathPhase }) {
  const tetra1Ref = useRef();
  const tetra2Ref = useRef();
  const octaRef = useRef();

  const tetraGeo = new THREE.TetrahedronGeometry(1);
  const mat1 = new THREE.MeshStandardMaterial({
    color: 0x3388ff,
    emissive: 0x1133ff,
    transparent: true,
    opacity: 0.6,
    roughness: 0.3,
    metalness: 0.4,
  });
  const mat2 = new THREE.MeshStandardMaterial({
    color: 0xffcc33,
    emissive: 0xff6600,
    transparent: true,
    opacity: 0.6,
    roughness: 0.3,
    metalness: 0.4,
  });

  const octaMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffcc,
    transparent: true,
    opacity: 0.15,
    emissiveIntensity: 0.6,
  });

  useFrame(({ clock }) => {
    const pulse = 0.5 + 0.5 * Math.sin(breathPhase * 2 * Math.PI);
    const spin = 0.01 + 0.005 * pulse;
    tetra1Ref.current.rotation.y += spin;
    tetra2Ref.current.rotation.y -= spin;
    octaRef.current.scale.setScalar(1 + 0.1 * pulse);
  });

  return (
    <group position={[0, -1.2, 0]}>
      <mesh ref={tetra1Ref} geometry={tetraGeo} material={mat1} />
      <mesh
        ref={tetra2Ref}
        geometry={tetraGeo}
        material={mat2}
        rotation={[0, Math.PI, 0]}
      />
      <mesh
        ref={octaRef}
        geometry={new THREE.OctahedronGeometry(0.8)}
        material={octaMat}
      />
    </group>
  );
}