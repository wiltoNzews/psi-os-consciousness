import React, { useContext } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { QCSContext } from "../context/QCSContext";
import FibonacciSpiral from "./modules/FibonacciSpiral";
import Tesseract4D from "./modules/Tesseract4D";
import MerkabahTetrahedron from "./modules/MerkabahTetrahedron";
import SriYantra from "./modules/SriYantra";

export default function CathedralMapInterface(): JSX.Element {
  const { activeGeometry, breathPhase, coherenceZλ } = useContext(QCSContext);

  return (
    <div className="w-full h-full fixed top-0 left-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />

        {(activeGeometry === "fibonacci" || activeGeometry === "fibonacciSpiral") && (
          <FibonacciSpiral breathPhase={breathPhase} />
        )}
        {activeGeometry === "tesseract" && (
          <Tesseract4D breathPhase={breathPhase} />
        )}
        {activeGeometry === "merkabah" && (
          <MerkabahTetrahedron breathPhase={breathPhase} />
        )}
        {(activeGeometry === "sri" || activeGeometry === "yantra" || activeGeometry === "sriYantra") && (
          <SriYantra breathPhase={breathPhase} />
        )}
        {activeGeometry === "all" && (
          <>
            <FibonacciSpiral breathPhase={breathPhase} />
            <Tesseract4D breathPhase={breathPhase} />
            <MerkabahTetrahedron breathPhase={breathPhase} />
            <SriYantra breathPhase={breathPhase} />
          </>
        )}

        {/* Future sacred geometry modules go here */}
      </Canvas>
    </div>
  );
}