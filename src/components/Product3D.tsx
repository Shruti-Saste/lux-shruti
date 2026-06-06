import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, Float } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { ClientOnly } from "./ClientOnly";

type Props = {
  model: "handbag" | "watch" | "heel" | "ring" | "scarf";
  colorHex: string;
  metallic?: boolean;
  className?: string;
  autoRotate?: boolean;
};

function Handbag({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 1.05, 0.55]} />
        <meshPhysicalMaterial color={color} roughness={0.45} clearcoat={0.4} clearcoatRoughness={0.3} />
      </mesh>
      {/* Flap */}
      <mesh position={[0, 0.1, 0.281]}>
        <boxGeometry args={[1.42, 0.7, 0.02]} />
        <meshPhysicalMaterial color={color} roughness={0.4} clearcoat={0.5} />
      </mesh>
      {/* Clasp */}
      <mesh position={[0, -0.18, 0.295]}>
        <boxGeometry args={[0.28, 0.12, 0.04]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.18} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.04, 16, 64, Math.PI]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Watch({ color }: { color: string }) {
  return (
    <group rotation={[0.4, 0, 0]}>
      {/* Case */}
      <mesh>
        <cylinderGeometry args={[0.7, 0.7, 0.16, 64]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.15} />
      </mesh>
      {/* Dial */}
      <mesh position={[0, 0.081, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.005, 64]} />
        <meshPhysicalMaterial color={color} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* Hands */}
      <mesh position={[0, 0.09, 0.05]}>
        <boxGeometry args={[0.02, 0.005, 0.4]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[0, 0, Math.PI / 3]}>
        <boxGeometry args={[0.02, 0.005, 0.28]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} />
      </mesh>
      {/* Straps */}
      <mesh position={[0, -0.05, 1]}>
        <boxGeometry args={[0.55, 0.1, 1.2]} />
        <meshPhysicalMaterial color="#1C1C1C" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.05, -1]}>
        <boxGeometry args={[0.55, 0.1, 1.2]} />
        <meshPhysicalMaterial color="#1C1C1C" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Heel({ color }: { color: string }) {
  return (
    <group rotation={[0, 0.6, 0]}>
      {/* Sole */}
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.45, 0.05, 1.5]} />
        <meshStandardMaterial color="#1C1C1C" roughness={0.5} />
      </mesh>
      {/* Toe */}
      <mesh position={[0, -0.4, 0.6]}>
        <sphereGeometry args={[0.32, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={0.6} />
      </mesh>
      {/* Vamp */}
      <mesh position={[0, -0.25, 0.1]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[0.42, 0.5, 0.9]} />
        <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.7} />
      </mesh>
      {/* Heel */}
      <mesh position={[0, -0.05, -0.55]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1, 12]} />
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Ring({ color }: { color: string }) {
  return (
    <group rotation={[Math.PI / 2.5, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.6, 0.13, 32, 128]} />
        <meshStandardMaterial color={color} metalness={1} roughness={0.18} />
      </mesh>
      {/* Stone */}
      <mesh position={[0, 0.65, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshPhysicalMaterial
          color="#E8D9B0"
          metalness={0.1}
          roughness={0.05}
          transmission={0.85}
          thickness={0.5}
          ior={1.8}
          clearcoat={1}
        />
      </mesh>
    </group>
  );
}

function Scarf({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(2.2, 1.4, 60, 40);
    return g;
  }, []);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 1.4 + t) * 0.12 + Math.cos(y * 2 + t * 0.8) * 0.08);
    }
    pos.needsUpdate = true;
  });
  return (
    <mesh ref={ref} geometry={geom} rotation={[-0.3, 0.4, 0]}>
      <meshPhysicalMaterial color={color} side={THREE.DoubleSide} roughness={0.6} sheen={1} sheenColor="#D4AF37" />
    </mesh>
  );
}

function Model({ model, color }: { model: Props["model"]; color: string }) {
  switch (model) {
    case "handbag": return <Handbag color={color} />;
    case "watch": return <Watch color={color} />;
    case "heel": return <Heel color={color} />;
    case "ring": return <Ring color={color} />;
    case "scarf": return <Scarf color={color} />;
  }
}

function Scene({ model, colorHex, autoRotate }: Props) {
  return (
    <Canvas shadows camera={{ position: [2.4, 1.6, 2.8], fov: 35 }} dpr={[1, 2]}>
      <color attach="background" args={["#F4ECD8"]} />
      <ambientLight intensity={0.4} />
      <spotLight position={[5, 8, 5]} angle={0.35} penumbra={1} intensity={2.2} castShadow color="#FFF7E8" />
      <spotLight position={[-4, 3, -4]} angle={0.5} penumbra={1} intensity={0.6} color="#D4AF37" />
      <Suspense fallback={null}>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.35}>
          <Model model={model} color={colorHex} />
        </Float>
        <ContactShadows position={[0, -0.95, 0]} opacity={0.5} scale={6} blur={2.4} far={2} />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={2}
        maxDistance={6}
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}

export function Product3D({ className, ...props }: Props) {
  return (
    <div className={className}>
      <ClientOnly fallback={<div className="size-full bg-secondary animate-pulse" />}>
        <Scene {...props} />
      </ClientOnly>
    </div>
  );
}
