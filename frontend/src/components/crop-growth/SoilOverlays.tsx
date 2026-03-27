import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SoilOverlayProps {
  moisture: number; // 0-100
  nitrogen: number; // 0-100
  phosphorus: number; // 0-100
  potassium: number; // 0-100
}

function MoistureIndicator({ moisture }: { moisture: number }) {
  const ref = useRef<THREE.Group>(null);
  const particleCount = Math.floor(moisture * 0.4);

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 1] = Math.random() * 0.3;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return arr;
  }, [particleCount]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={ref} position={[0, 0.12, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#4fc3f7" size={0.08} transparent opacity={0.5} sizeAttenuation />
      </points>
    </group>
  );
}

function NutrientBar({ position, value, color, label }: { position: [number, number, number]; value: number; color: string; label: string }) {
  const maxHeight = 1.5;
  const height = (value / 100) * maxHeight;

  return (
    <group position={position}>
      {/* Background bar */}
      <mesh position={[0, maxHeight / 2, 0]}>
        <boxGeometry args={[0.2, maxHeight, 0.2]} />
        <meshStandardMaterial color="#444" transparent opacity={0.2} />
      </mesh>
      {/* Value bar */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.22, height, 0.22]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>
      {/* Top sphere indicator */}
      <mesh position={[0, height + 0.1, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

export default function SoilOverlays({ moisture, nitrogen, phosphorus, potassium }: SoilOverlayProps) {
  return (
    <group>
      <MoistureIndicator moisture={moisture} />
      <NutrientBar position={[-3.2, 0.15, -3.2]} value={nitrogen} color="#4fc3f7" label="N" />
      <NutrientBar position={[-3.2, 0.15, -2.5]} value={phosphorus} color="#ffb74d" label="P" />
      <NutrientBar position={[-3.2, 0.15, -1.8]} value={potassium} color="#81c784" label="K" />
    </group>
  );
}
