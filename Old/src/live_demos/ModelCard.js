import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function AnimatedShape({ position, color, speed, shape }) {
  const meshRef = useRef();
  const randomOffset = useRef({
    x: Math.random() * Math.PI * 2,
    y: Math.random() * Math.PI * 2,
    z: Math.random() * Math.PI * 2,
  });

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Random circular movement
    meshRef.current.position.x =
      position[0] + Math.sin(time * 0.5 + randomOffset.current.x) * 0.5;
    meshRef.current.position.y =
      position[1] + Math.sin(time * 0.7 + randomOffset.current.y) * 0.3;
    meshRef.current.position.z =
      Math.cos(time * 0.3 + randomOffset.current.z) * 0.5;

    // Rotation
    meshRef.current.rotation.x += speed * 0.01;
    meshRef.current.rotation.y += speed * 0.01;

    // Subtle size pulsing
    const scale = 1 + Math.sin(time * 2) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef} position={position}>
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

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#60a5fa" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#93c5fd" />
      <spotLight
        position={[5, 5, 5]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        castShadow
      />
      <AnimatedShape
        position={[-2, 0, 0]}
        color="#3b82f6"
        speed={1}
        shape="box"
      />
      <AnimatedShape
        position={[0, 0, 0]}
        color="#60a5fa"
        speed={1.5}
        shape="sphere"
      />
      <AnimatedShape
        position={[2, 0, 0]}
        color="#93c5fd"
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

const ModelCard = () => {
  return (
    <div
      className="max-w-md mx-auto p-6 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl 
      border border-gray-700 hover:border-blue-500/20 transition-all duration-300"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-100">
        Interactive 3D Scene
      </h2>
      <div className="relative rounded-lg overflow-hidden bg-gray-900/50">
        <div style={{ width: "100%", height: "400px" }}>
          <Canvas camera={{ position: [0, 2, 8] }}>
            <Scene />
          </Canvas>
        </div>
        <div
          className="absolute bottom-4 left-4 text-gray-300 text-sm bg-gray-900/80 
          backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700"
        >
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
