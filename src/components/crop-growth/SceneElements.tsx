import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#5a3d2b" roughness={1} />
    </mesh>
  );
}

export function GrassPatches() {
  const patches = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 60; i++) {
      const x = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 18;
      if (Math.abs(x) < 3 && Math.abs(z) < 3) continue;
      arr.push({ pos: [x, 0, z], scale: 0.3 + Math.random() * 0.4 });
    }
    return arr;
  }, []);

  return (
    <>
      {patches.map((p, i) => (
        <mesh key={i} position={p.pos} scale={p.scale}>
          <coneGeometry args={[0.08, 0.4, 4]} />
          <meshStandardMaterial color="#2d6a4f" />
        </mesh>
      ))}
    </>
  );
}

export function SoilBed() {
  return (
    <group position={[0, 0.05, 0]}>
      <RoundedBox args={[5, 0.15, 5]} radius={0.05} position={[0, 0, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#8B6914" roughness={0.9} />
      </RoundedBox>
      {[-1.5, -0.5, 0.5, 1.5].map((z, i) => (
        <mesh key={i} position={[0, 0.1, z]} castShadow>
          <boxGeometry args={[4.5, 0.06, 0.35]} />
          <meshStandardMaterial color="#6B4F1A" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

interface CropPlantProps {
  progress: number;
  color: string;
  position: [number, number, number];
}

export function CropPlant({ progress, color, position }: CropPlantProps) {
  const ref = useRef<THREE.Group>(null);
  const height = progress * 2.5;
  const leafCount = Math.floor(progress * 6);
  const hasFruit = progress > 0.7;

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1;
    }
  });

  if (progress < 0.05) {
    return (
      <mesh position={[position[0], 0.15, position[2]]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
    );
  }

  return (
    <group position={position} ref={ref}>
      <mesh position={[0, 0.15 + height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.03 + progress * 0.02, 0.04 + progress * 0.02, height, 8]} />
        <meshStandardMaterial color="#2d6a4f" />
      </mesh>
      {Array.from({ length: leafCount }).map((_, i) => {
        const angle = (i / leafCount) * Math.PI * 2;
        const leafY = 0.15 + (height * (i + 1)) / (leafCount + 1);
        const leafSize = 0.15 + progress * 0.25;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.15, leafY, Math.sin(angle) * 0.15]}
            rotation={[0.3, angle, Math.PI * 0.15]}
            castShadow
          >
            <planeGeometry args={[leafSize, leafSize * 0.4]} />
            <meshStandardMaterial color="#38a169" side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {hasFruit && (
        <mesh position={[0, 0.15 + height + 0.12, 0]} castShadow>
          <sphereGeometry args={[0.1 + (progress - 0.7) * 0.4, 12, 12]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      )}
    </group>
  );
}
