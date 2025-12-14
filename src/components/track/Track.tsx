import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoadSegment } from './RoadSegment';
import { StreetLight } from './StreetLight';
import { TRACK_LENGTH, SEGMENTS_AHEAD, SEGMENTS_BEHIND } from '../../constants/game';

interface TrackProps {
  speed: number;
  playerPosition: THREE.Vector3 | null;
}

interface Segment {
  id: string;
  z: number;
}

const Track: React.FC<TrackProps> = ({ playerPosition }) => {
  const roadMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#333340' }), []);
  const lineMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff' }), []);
  const yellowLineMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffcc00' }), []);

  const playerZ = playerPosition?.z ?? 0;
  const currentSegmentIndex = Math.floor(-playerZ / TRACK_LENGTH);

  const segments = useMemo<Segment[]>(() => {
    const segs: Segment[] = [];
    for (let i = -SEGMENTS_BEHIND; i <= SEGMENTS_AHEAD; i++) {
      const segIndex = currentSegmentIndex + i;
      const segZ = -segIndex * TRACK_LENGTH;
      segs.push({ id: `segment-${segIndex}`, z: segZ });
    }
    return segs;
  }, [currentSegmentIndex]);

  return (
    <>
      {segments.map(seg => (
        <RoadSegment
          key={seg.id}
          z={seg.z}
          roadMaterial={roadMaterial}
          lineMaterial={lineMaterial}
          yellowLineMaterial={yellowLineMaterial}
        />
      ))}

      {segments.map(seg => {
        const lightZ = seg.z - TRACK_LENGTH / 2;
        return (
          <group key={`lights-${seg.id}`}>
            <StreetLight z={lightZ} side="left" />
            <StreetLight z={lightZ} side="right" />
          </group>
        );
      })}
    </>
  );
};

export default Track;
