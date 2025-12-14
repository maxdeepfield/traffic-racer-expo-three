import React from 'react';
import * as THREE from 'three';
import { TRACK_LENGTH, TRACK_WIDTH } from '../../constants/game';

interface RoadSegmentProps {
  z: number;
  roadMaterial: THREE.MeshStandardMaterial;
  lineMaterial: THREE.MeshBasicMaterial;
  yellowLineMaterial: THREE.MeshBasicMaterial;
}

const DASH_LENGTH = 3;
const DASH_GAP = 4;
const DASHES_PER_SEGMENT = Math.floor(TRACK_LENGTH / (DASH_LENGTH + DASH_GAP));

export const RoadSegment: React.FC<RoadSegmentProps> = ({
  z,
  roadMaterial,
  lineMaterial,
  yellowLineMaterial,
}) => (
  <group position={[0, 0, z]}>
    {/* Road surface */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -TRACK_LENGTH / 2]} receiveShadow>
      <planeGeometry args={[TRACK_WIDTH, TRACK_LENGTH]} />
      <primitive object={roadMaterial} />
    </mesh>

    {/* Road edges */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-TRACK_WIDTH / 2 + 0.1, 0.01, -TRACK_LENGTH / 2]}>
      <planeGeometry args={[0.15, TRACK_LENGTH]} />
      <primitive object={lineMaterial} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[TRACK_WIDTH / 2 - 0.1, 0.01, -TRACK_LENGTH / 2]}>
      <planeGeometry args={[0.15, TRACK_LENGTH]} />
      <primitive object={lineMaterial} />
    </mesh>

    {/* Center divider */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.12, 0.01, -TRACK_LENGTH / 2]}>
      <planeGeometry args={[0.08, TRACK_LENGTH]} />
      <primitive object={yellowLineMaterial} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.12, 0.01, -TRACK_LENGTH / 2]}>
      <planeGeometry args={[0.08, TRACK_LENGTH]} />
      <primitive object={yellowLineMaterial} />
    </mesh>

    {/* Dashed lane markers */}
    {Array.from({ length: DASHES_PER_SEGMENT }).map((_, i) => {
      const dashZ = -i * (DASH_LENGTH + DASH_GAP) - DASH_LENGTH / 2;
      return (
        <group key={`dash-${i}`}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.4, 0.01, dashZ]}>
            <planeGeometry args={[0.1, DASH_LENGTH]} />
            <primitive object={lineMaterial} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.4, 0.01, dashZ]}>
            <planeGeometry args={[0.1, DASH_LENGTH]} />
            <primitive object={lineMaterial} />
          </mesh>
        </group>
      );
    })}

    {/* Guardrails */}
    <mesh position={[-TRACK_WIDTH / 2 - 0.3, 0.3, -TRACK_LENGTH / 2]}>
      <boxGeometry args={[0.3, 0.6, TRACK_LENGTH]} />
      <meshStandardMaterial color="#888888" />
    </mesh>
    <mesh position={[TRACK_WIDTH / 2 + 0.3, 0.3, -TRACK_LENGTH / 2]}>
      <boxGeometry args={[0.3, 0.6, TRACK_LENGTH]} />
      <meshStandardMaterial color="#888888" />
    </mesh>
  </group>
);
