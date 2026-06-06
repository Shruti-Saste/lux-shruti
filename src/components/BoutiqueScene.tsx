import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float, MeshReflectorMaterial, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { ClientOnly } from "./ClientOnly";

function Pedestal({ x, children }: { x: number; children: React.ReactNode }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.6, 0.8, 48]} />
        <meshStandardMaterial color="#1C1C1C" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.02, 48]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
      </mesh>
      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.4}>
        <group position={[0, 0.3, 0]}>{children}</group>
      </Float>
      <spotLight position={[0, 3, 0]} angle={0.45} penumbra={0.8} intensity={1.8} castShadow color="#FFF7E8" />
    </group>
  );
}

function HeroBag() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.3;
  });
  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.7, 0.36]} />
        <meshPhysicalMaterial color="#1C1C1C" roughness={0.35} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.03, 16, 48, Math.PI]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.18} />
      </mesh>
      <mesh position={[0, -0.05, 0.19]}>
        <boxGeometry args={[0.2, 0.08, 0.03]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} />
      </mesh>
    </group>
  );
}

function HeroRing() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.4;
  });
  return (
    <group ref={ref} rotation={[Math.PI / 3, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.42, 0.09, 24, 96]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshPhysicalMaterial color="#FFF7E8" transmission={0.9} roughness={0.05} ior={1.8} thickness={0.5} clearcoat={1} />
      </mesh>
    </group>
  );
}

function HeroWatch() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.5;
  });
  return (
    <group ref={ref} rotation={[0.5, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.45, 0.45, 0.12, 64]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.061, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.005, 64]} />
        <meshPhysicalMaterial color="#0A0A0A" clearcoat={1} roughness={0.15} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <Canvas shadows dpr={[1, 1.8]}>
      <PerspectiveCamera makeDefault position={[0, 0.6, 4.5]} fov={42} />
      <color attach="background" args={["#F4ECD8"]} />
      <fog attach="fog" args={["#F4ECD8", 6, 14]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 4]} intensity={1.2} color="#FFF7E8" castShadow />

      <Suspense fallback={null}>
        {/* Marble floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={20}
            roughness={0.85}
            depthScale={1}
            minDepthThreshold={0.85}
            color="#E8DCC0"
            metalness={0.2}
            mirror={0.5}
          />
        </mesh>

        <Pedestal x={-2.4}><HeroRing /></Pedestal>
        <Pedestal x={0}><HeroBag /></Pedestal>
        <Pedestal x={2.4}><HeroWatch /></Pedestal>

        <ContactShadows position={[0, -1.04, 0]} opacity={0.4} scale={14} blur={2.5} far={3} />
        <Environment preset="apartment" />
      </Suspense>
    </Canvas>
  );
}

export function BoutiqueScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ClientOnly fallback={<div className="size-full bg-gradient-to-b from-secondary to-background" />}>
        <Scene />
      </ClientOnly>
    </div>
  );
}
