import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Stars, PerspectiveCamera } from "@react-three/drei";
import type * as THREE from "three";

function AnimatedOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.22;
    }
  });
  return (
    <Sphere ref={meshRef} args={[1, 96, 192]} scale={2.3} position={[1.6, 0, 0]}>
      <MeshDistortMaterial color="#F5C518" attach="material" distort={0.45} speed={1.6} roughness={0.15} metalness={0.6} />
    </Sphere>
  );
}

export default function HeroOrb() {
  return (
    <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[10, 10, 10]} intensity={60} color="#fff4cc" />
      <pointLight position={[-8, -6, 4]} intensity={25} color="#C99A00" />
      <Stars radius={100} depth={50} count={3500} factor={4} saturation={0} fade speed={0.8} />
      <AnimatedOrb />
    </Canvas>
  );
}
