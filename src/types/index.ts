import * as THREE from 'three';

export interface GameState {
  score: number;
  gameOver: boolean;
  speed: number;
  paused: boolean;
}

export interface PlayerRef {
  position: THREE.Vector3;
  getWorldPosition: () => THREE.Vector3;
}

export interface CarData {
  id: number;
  x: number;
  z: number;
  color: string;
  isOncoming: boolean;
}

export interface CoinData {
  id: string;
  x: number;
  z: number;
  collected: boolean;
}

export type Position3 = [number, number, number];
