import type * as THREE from "three"
import type { RigidBodyProps } from "@react-three/rapier"

// Definisi untuk GLTF model
export interface LanyardGLTF {
  nodes: {
    card: THREE.Mesh
    clip: THREE.Mesh
    clamp: THREE.Mesh
  }
  materials: {
    metal: THREE.Material
  }
}

// Definisi untuk RigidBody reference
export interface RigidBodyRef {
  translation: () => THREE.Vector3
  rotation: () => THREE.Euler
  angvel: () => THREE.Vector3
  setAngvel: (velocity: { x: number; y: number; z: number }) => void
  setNextKinematicTranslation: (position: { x: number; y: number; z: number }) => void
  wakeUp: () => void
  lerped?: THREE.Vector3
}

// Definisi untuk segment properties
export interface SegmentProps {
  type: RigidBodyProps["type"]
  canSleep: boolean
  colliders: boolean
  angularDamping: number
  linearDamping: number
}

// Definisi untuk pointer event
export interface PointerEvent {
  target: {
    setPointerCapture: (pointerId: number) => void
    releasePointerCapture: (pointerId: number) => void
  }
  pointerId: number
  point: THREE.Vector3
}

// Extend untuk MeshLine components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any
      meshLineMaterial: any
    }
  }
}
