import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type WeatherType = 'sunny' | 'rainy' | 'cloudy' | 'stormy';

interface RainProps {
  count?: number;
  intensity?: number;
}

function Rain({ count = 800, intensity = 1 }: RainProps) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = Math.random() * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i) - delta * 8 * intensity;
      pos.setY(i, y < -0.5 ? 10 + Math.random() * 2 : y);
      pos.setX(i, pos.getX(i) - delta * 0.5);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#aaccff"
        size={0.06}
        transparent
        opacity={0.6 * intensity}
        sizeAttenuation
      />
    </points>
  );
}

function Cloud({ position, scale = 1, opacity = 0.7 }: { position: [number, number, number]; scale?: number; opacity?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x += delta * 0.15;
      if (ref.current.position.x > 12) ref.current.position.x = -12;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial color="#c8d6e5" transparent opacity={opacity} roughness={1} />
      </mesh>
      <mesh position={[0.7, 0.1, 0.2]}>
        <sphereGeometry args={[0.65, 12, 12]} />
        <meshStandardMaterial color="#dfe6ed" transparent opacity={opacity} roughness={1} />
      </mesh>
      <mesh position={[-0.6, -0.05, -0.1]}>
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshStandardMaterial color="#d1dbe6" transparent opacity={opacity} roughness={1} />
      </mesh>
      <mesh position={[0.1, 0.3, 0.1]}>
        <sphereGeometry args={[0.55, 12, 12]} />
        <meshStandardMaterial color="#e0e8f0" transparent opacity={opacity} roughness={1} />
      </mesh>
    </group>
  );
}

function SunRays({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  const rays = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      length: 1.5 + Math.random() * 1.5,
      width: 0.08 + Math.random() * 0.06,
    }));
  }, []);

  return (
    <group ref={ref} position={[5, 7, 2]}>
      {/* Sun sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#fff5c0" />
      </mesh>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#fff5c0" transparent opacity={0.2 * intensity} />
      </mesh>
      {/* Rays */}
      {rays.map((ray, i) => (
        <mesh
          key={i}
          position={[Math.cos(ray.angle) * (ray.length / 2 + 0.6), Math.sin(ray.angle) * (ray.length / 2 + 0.6), 0]}
          rotation={[0, 0, ray.angle + Math.PI / 2]}
        >
          <planeGeometry args={[ray.width, ray.length]} />
          <meshBasicMaterial color="#fffbe6" transparent opacity={0.15 * intensity} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function Lightning() {
  const ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // Random flash every ~4 seconds
    const flash = Math.sin(t * 80) > 0.998;
    ref.current.intensity = flash ? 15 : 0;
  });

  return <pointLight ref={ref} position={[0, 10, 0]} color="#c8e0ff" intensity={0} />;
}

interface WeatherEffectsProps {
  weather: WeatherType;
}

export default function WeatherEffects({ weather }: WeatherEffectsProps) {
  return (
    <>
      {/* Clouds for cloudy/rainy/stormy */}
      {(weather === 'cloudy' || weather === 'rainy' || weather === 'stormy') && (
        <>
          <Cloud position={[-4, 6, -2]} scale={1.4} opacity={weather === 'stormy' ? 0.9 : 0.6} />
          <Cloud position={[2, 7, -3]} scale={1.1} opacity={weather === 'stormy' ? 0.85 : 0.55} />
          <Cloud position={[-1, 6.5, 1]} scale={1.3} opacity={weather === 'stormy' ? 0.9 : 0.65} />
          <Cloud position={[5, 7.5, 0]} scale={0.9} opacity={0.5} />
          <Cloud position={[-6, 7, 2]} scale={1.0} opacity={0.5} />
        </>
      )}

      {/* Light clouds for sunny */}
      {weather === 'sunny' && (
        <>
          <Cloud position={[-5, 8, -4]} scale={0.7} opacity={0.25} />
          <Cloud position={[6, 8.5, -2]} scale={0.5} opacity={0.2} />
        </>
      )}

      {/* Rain */}
      {(weather === 'rainy' || weather === 'stormy') && (
        <Rain count={weather === 'stormy' ? 1500 : 600} intensity={weather === 'stormy' ? 1.5 : 1} />
      )}

      {/* Sun rays for sunny weather */}
      {weather === 'sunny' && <SunRays intensity={1} />}
      {weather === 'cloudy' && <SunRays intensity={0.3} />}

      {/* Lightning for stormy */}
      {weather === 'stormy' && <Lightning />}

      {/* Adjust ambient based on weather */}
      <ambientLight intensity={weather === 'sunny' ? 0.6 : weather === 'cloudy' ? 0.35 : weather === 'rainy' ? 0.25 : 0.15} />
    </>
  );
}

export type { WeatherType };
