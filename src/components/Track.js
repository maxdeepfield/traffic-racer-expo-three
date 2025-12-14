import { useMemo } from 'react';
import * as THREE from 'three';

export default function Track({ speed, playerPosition }) {
  const trackLength = 60;
  const trackWidth = 10;
  const SEGMENTS_AHEAD = 8;
  const SEGMENTS_BEHIND = 2;

  const roadMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#333340' }), []);
  const lineMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff' }), []);
  const yellowLineMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffcc00' }), []);

  const playerZ = playerPosition?.z ?? 0;
  const currentSegmentIndex = Math.floor(-playerZ / trackLength);

  const segments = useMemo(() => {
    const segs = [];
    for (let i = -SEGMENTS_BEHIND; i <= SEGMENTS_AHEAD; i++) {
      const segIndex = currentSegmentIndex + i;
      const segZ = -segIndex * trackLength;
      segs.push({ id: `segment-${segIndex}`, z: segZ });
    }
    return segs;
  }, [currentSegmentIndex]);

  // Dashed lane markers
  const dashLength = 3;
  const dashGap = 4;
  const dashesPerSegment = Math.floor(trackLength / (dashLength + dashGap));

  return (
    <>
      {segments.map(seg => (
        <group key={seg.id} position={[0, 0, seg.z]}>
          {/* Road surface - receives shadows from headlights */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -trackLength / 2]} receiveShadow>
            <planeGeometry args={[trackWidth, trackLength]} />
            <primitive object={roadMaterial} />
          </mesh>

          {/* Road edges - solid white lines */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-trackWidth / 2 + 0.1, 0.01, -trackLength / 2]}>
            <planeGeometry args={[0.15, trackLength]} />
            <primitive object={lineMaterial} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[trackWidth / 2 - 0.1, 0.01, -trackLength / 2]}>
            <planeGeometry args={[0.15, trackLength]} />
            <primitive object={lineMaterial} />
          </mesh>

          {/* Center divider - double yellow */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.12, 0.01, -trackLength / 2]}>
            <planeGeometry args={[0.08, trackLength]} />
            <primitive object={yellowLineMaterial} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.12, 0.01, -trackLength / 2]}>
            <planeGeometry args={[0.08, trackLength]} />
            <primitive object={yellowLineMaterial} />
          </mesh>

          {/* Dashed lane markers */}
          {Array.from({ length: dashesPerSegment }).map((_, i) => {
            const dashZ = -i * (dashLength + dashGap) - dashLength / 2;
            return (
              <group key={`dash-${i}`}>
                {/* Left lane marker */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.4, 0.01, dashZ]}>
                  <planeGeometry args={[0.1, dashLength]} />
                  <primitive object={lineMaterial} />
                </mesh>
                {/* Right lane marker */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.4, 0.01, dashZ]}>
                  <planeGeometry args={[0.1, dashLength]} />
                  <primitive object={lineMaterial} />
                </mesh>
              </group>
            );
          })}

          {/* Roadside barriers/guardrails */}
          <mesh position={[-trackWidth / 2 - 0.3, 0.3, -trackLength / 2]}>
            <boxGeometry args={[0.3, 0.6, trackLength]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
          <mesh position={[trackWidth / 2 + 0.3, 0.3, -trackLength / 2]}>
            <boxGeometry args={[0.3, 0.6, trackLength]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        </group>
      ))}

      {/* Street lights - 1 per segment */}
      {segments.map((seg) => {
        const lightZ = seg.z - trackLength / 2;
        return (
          <group key={`lights-${seg.id}`}>
            {/* Left light pole */}
            <mesh position={[-trackWidth / 2 - 2, 3, lightZ]}>
              <cylinderGeometry args={[0.1, 0.15, 6]} />
              <meshStandardMaterial color="#444444" />
            </mesh>
            <mesh position={[-trackWidth / 2 - 1, 5.8, lightZ]}>
              <boxGeometry args={[2, 0.1, 0.3]} />
              <meshStandardMaterial color="#444444" />
            </mesh>
            {/* Light bulb glow */}
            <mesh position={[-trackWidth / 2 - 0.5, 5.6, lightZ]}>
              <sphereGeometry args={[0.4, 8, 8]} />
              <meshStandardMaterial color="#ffffee" emissive="#ffeeaa" emissiveIntensity={10} />
            </mesh>
            {/* Street lamp light source */}
            <pointLight position={[-trackWidth / 2 - 0.5, 5.5, lightZ]} intensity={4} distance={25} color="#ffeecc" />
            
            {/* Right light pole */}
            <mesh position={[trackWidth / 2 + 2, 3, lightZ]}>
              <cylinderGeometry args={[0.1, 0.15, 6]} />
              <meshStandardMaterial color="#444444" />
            </mesh>
            <mesh position={[trackWidth / 2 + 1, 5.8, lightZ]}>
              <boxGeometry args={[2, 0.1, 0.3]} />
              <meshStandardMaterial color="#444444" />
            </mesh>
            {/* Light bulb glow */}
            <mesh position={[trackWidth / 2 + 0.5, 5.6, lightZ]}>
              <sphereGeometry args={[0.4, 8, 8]} />
              <meshStandardMaterial color="#ffffee" emissive="#ffeeaa" emissiveIntensity={10} />
            </mesh>
            {/* Street lamp light source */}
            <pointLight position={[trackWidth / 2 + 0.5, 5.5, lightZ]} intensity={4} distance={25} color="#ffeecc" />
          </group>
        );
      })}
    </>
  );
}
