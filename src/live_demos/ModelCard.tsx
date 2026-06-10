import { useRef, useState } from "react";
import type { FC } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface AnimatedShapeProps {
  position: [number, number, number];
  color: string;
  speed: number;
  shape: "box" | "sphere" | "torus";
}

const AnimatedShape: FC<AnimatedShapeProps> = ({ position, color, speed, shape }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [randomOffsets] = useState(() => ({
    x: Math.random() * Math.PI * 2,
    y: Math.random() * Math.PI * 2,
    z: Math.random() * Math.PI * 2,
  }));

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Random circular movement
    meshRef.current.position.x =
      position[0] + Math.sin(time * 0.5 + randomOffsets.x) * 0.5;
    meshRef.current.position.y =
      position[1] + Math.sin(time * 0.7 + randomOffsets.y) * 0.3;
    meshRef.current.position.z =
      Math.cos(time * 0.3 + randomOffsets.z) * 0.5;

    // Rotation
    meshRef.current.rotation.x += speed * 0.01;
    meshRef.current.rotation.y += speed * 0.01;

    // Subtle size pulsing
    const scale = 1 + Math.sin(time * 2) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      onClick={(e: ThreeEvent<MouseEvent>) => e.stopPropagation()}
    >
      {shape === "box" && <boxGeometry args={[1.5, 1.5, 1.5]} />}
      {shape === "sphere" && <sphereGeometry args={[1, 32, 32]} />}
      {shape === "torus" && <torusGeometry args={[1, 0.3, 16, 32]} />}
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.2}
        envMapIntensity={2}
      />
    </mesh>
  );
}

const Scene: FC = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#10b981" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#4f46e5" />
      <spotLight
        position={[5, 5, 5]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        castShadow
      />
      <AnimatedShape
        position={[-2, 0, 0]}
        color="#10b981"
        speed={1}
        shape="box"
      />
      <AnimatedShape
        position={[0, 0, 0]}
        color="#4f46e5"
        speed={1.5}
        shape="sphere"
      />
      <AnimatedShape
        position={[2, 0, 0]}
        color="#f59e0b"
        speed={2}
        shape="torus"
      />
      <OrbitControls
        enableZoom={true}
        autoRotate
        autoRotateSpeed={0.5}
        maxDistance={20}
        minDistance={5}
      />
    </>
  );
};

const ModelCard: FC = () => {
  return (
    <div
      className="max-w-md mx-auto p-6 bg-surface/60 backdrop-blur-xl rounded-lg shadow-2xl 
      border border-border hover:border-primary/20 transition-all duration-300"
    >
      <h2 className="text-xl font-bold mb-4 text-ink tracking-tight uppercase">
        Interactive 3D Scene
      </h2>
      <div className="relative rounded-lg overflow-hidden bg-neutral-bg/50">
        <div style={{ width: "100%", height: "400px" }}>
          <Canvas camera={{ position: [0, 2, 8] }}>
            <Scene />
          </Canvas>
        </div>
        <div
          className="absolute bottom-4 left-4 text-ink/40 text-[10px] bg-neutral-bg/80 
          backdrop-blur-md px-3 py-1 rounded-full border border-border font-mono uppercase tracking-widest"
        >
          Control: Drag to Rotate • Action: Scroll to Zoom
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
