import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

const CAR_SPACING = 20;
const CAR_COUNT = 14;

const CAR_COLORS = ['#3366cc', '#33cc66', '#cc9933', '#9933cc', '#33cccc', '#666666', '#ffffff', '#cc6633'];

function TrafficCar({ position, onCollision, playerPosition, gameStarted, color, carSpeed, isOncoming, onUpdateZ }) {
  const groupRef = useRef();
  const localZRef = useRef(position[2]);

  // Sync with parent state when position changes significantly (respawn)
  useEffect(() => {
    localZRef.current = position[2];
  }, [position[2]]);

  useFrame(() => {
    if (!groupRef.current || !playerPosition || !gameStarted) return;

    // Faster speeds for both directions
    if (isOncoming) {
      localZRef.current += carSpeed * 2.0; // Oncoming even faster
    } else {
      localZRef.current += carSpeed * 0.5; // Same direction slightly slower
    }

    const carWorldZ = localZRef.current;
    const carWorldX = position[0];

    // Collision detection
    const distanceX = Math.abs(carWorldX - playerPosition.x);
    const distanceZ = Math.abs(carWorldZ - playerPosition.z);

    if (distanceX < 1.4 && distanceZ < 2.5) {
      onCollision();
    }

    groupRef.current.position.z = localZRef.current;
    
    // Report position back to parent for respawn logic
    onUpdateZ(localZRef.current);
  });

  // Right side cars (same direction): no rotation, player sees taillights (rear at +Z toward player)
  // Left side cars (oncoming): rotate 180°, player sees headlights (front at +Z toward player)
  const rotation = isOncoming ? 0 : Math.PI;

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      <group rotation={[0, rotation, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.45, 3.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.7, -0.1]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.35, 1.6]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.7, 0.7]} rotation={[0.25, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.3, 0.05]} />
          <meshStandardMaterial color="#334455" />
        </mesh>
        {[[-0.65, 0.18, 0.9], [0.65, 0.18, 0.9], [-0.65, 0.18, -1.1], [0.65, 0.18, -1.1]].map((pos, i) => (
          <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.18, 10]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        ))}
        {/* Headlights - front (bright emissive glow) */}
        <mesh position={[-0.45, 0.35, 1.61]}>
          <boxGeometry args={[0.25, 0.12, 0.02]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffcc" emissiveIntensity={5} />
        </mesh>
        <mesh position={[0.45, 0.35, 1.61]}>
          <boxGeometry args={[0.25, 0.12, 0.02]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffcc" emissiveIntensity={5} />
        </mesh>
        {/* Headlight beam */}
        <spotLight
          position={[0, 0.35, 1.8]}
          angle={0.6}
          penumbra={0.5}
          intensity={8}
          distance={25}
          color="#ffffee"
        />
        {/* Taillights - rear (bright red glow) */}
        <mesh position={[-0.45, 0.35, -1.61]}>
          <boxGeometry args={[0.25, 0.12, 0.02]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={5} />
        </mesh>
        <mesh position={[0.45, 0.35, -1.61]}>
          <boxGeometry args={[0.25, 0.12, 0.02]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={5} />
        </mesh>
        {/* Taillight glow */}
        <pointLight position={[0, 0.35, -1.8]} intensity={3} distance={8} color="#ff0000" />
      </group>
    </group>
  );
}


export default function Obstacles({ speed, onCollision, playerPosition, gameStarted = true }) {
  const [cars, setCars] = useState([]);
  const carZRefs = useRef({});

  useEffect(() => {
    const initialCars = [];
    const rightLanes = [1.2, 3.5];
    const leftLanes = [-3.5, -1.2];
    
    for (let i = 0; i < CAR_COUNT; i++) {
      const isOncoming = i < CAR_COUNT / 2;
      const lanes = isOncoming ? leftLanes : rightLanes;
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      const color = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];
      const z = -25 - i * CAR_SPACING - Math.random() * 10;
      initialCars.push({ id: i, x: lane, z, color, isOncoming });
      carZRefs.current[i] = z;
    }
    setCars(initialCars);
  }, []);

  useFrame(() => {
    if (!playerPosition) return;
    const playerZ = playerPosition.z;
    const rightLanes = [1.2, 3.5];
    const leftLanes = [-3.5, -1.2];

    setCars(prev => {
      let needsUpdate = false;
      const updated = prev.map(car => {
        const currentZ = carZRefs.current[car.id] ?? car.z;
        if (currentZ > playerZ + 40) {
          needsUpdate = true;
          const lanes = car.isOncoming ? leftLanes : rightLanes;
          const lane = lanes[Math.floor(Math.random() * lanes.length)];
          const color = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];
          const newZ = playerZ - 80 - Math.random() * 30;
          carZRefs.current[car.id] = newZ;
          return { ...car, x: lane, z: newZ, color };
        }
        return car;
      });
      return needsUpdate ? updated : prev;
    });
  });

  const handleUpdateZ = (id, z) => {
    carZRefs.current[id] = z;
  };

  return (
    <>
      {cars.map(car => (
        <TrafficCar
          key={car.id}
          position={[car.x, 0, car.z]}
          onCollision={onCollision}
          playerPosition={playerPosition}
          gameStarted={gameStarted}
          color={car.color}
          carSpeed={speed}
          isOncoming={car.isOncoming}
          onUpdateZ={(z) => handleUpdateZ(car.id, z)}
        />
      ))}
    </>
  );
}
