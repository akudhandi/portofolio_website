/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unknown-property */

"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber"
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei"
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RigidBodyProps,
} from "@react-three/rapier"
import { MeshLineGeometry, MeshLineMaterial } from "meshline"
import * as THREE from "three"

// Extend MeshLine into Fiber
extend({ MeshLineGeometry, MeshLineMaterial })

// Asset paths
const cardGLB = "/assets/lanyard/card.glb"
const lanyardStrapTexturePath = "/assets/lanyard/lanyard.png"
const cardDesignTexturePath = "/assets/lanyard/card lanyard.png"

interface LanyardProps {
  position?: [number, number, number]
  gravity?: [number, number, number]
  fov?: number
  transparent?: boolean
}

export default function Lanyard({
  position = [0, 0, 7],
  gravity = [0, -20, 0],
  fov = 50,
  transparent = true,
}: LanyardProps) {
  return (
    <div className="relative z-0 w-full h-screen flex justify-center items-center">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position, fov }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <Environment preset="city" blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>

        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <Physics gravity={gravity} timeStep={1 / 60}>
          <Band />
        </Physics>
      </Canvas>
    </div>
  )
}

interface BandProps {
  maxSpeed?: number
  minSpeed?: number
}

function Band({ maxSpeed = 50, minSpeed = 0 }: BandProps) {
  const bandRef = useRef<THREE.Mesh>(null)
  const fixed = useRef<any>(null)
  const j1 = useRef<any>(null)
  const j2 = useRef<any>(null)
  const j3 = useRef<any>(null)
  const card = useRef<any>(null)

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()

  const segmentProps = {
    type: "dynamic" as RigidBodyProps["type"],
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  }

  // Load GLB model dan tekstur
  const gltf = useGLTF(cardGLB)
  const nodes = gltf.nodes as any
  const materials = gltf.materials as any

  const lanyardStrapTexture = useTexture(lanyardStrapTexturePath)
  const cardDesignTexture = useTexture(cardDesignTexturePath)

  const { width, height } = useThree((state) => state.size)

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]),
  )

  const [dragged, drag] = useState<false | THREE.Vector3>(false)
  const [hovered, hover] = useState(false)

  useEffect(() => {
    if (cardDesignTexture) {
      cardDesignTexture.flipY = false
      cardDesignTexture.needsUpdate = true
    }
    if (lanyardStrapTexture) {
      lanyardStrapTexture.wrapS = lanyardStrapTexture.wrapT = THREE.RepeatWrapping
      lanyardStrapTexture.needsUpdate = true
    }
  }, [cardDesignTexture, lanyardStrapTexture])

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab"
      return () => {
        document.body.style.cursor = "auto"
      }
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== "boolean") {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp?.())

      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      })
    }

    if (fixed.current && bandRef.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })

      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      ;(bandRef.current.geometry as any).setPoints(curve.getPoints(32))

      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
  })

  curve.curveType = "chordal"

  const handlePointerDown = (e: any) => {
    e.target.setPointerCapture(e.pointerId)
    drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
  }

  const handlePointerUp = (e: any) => {
    e.target.releasePointerCapture(e.pointerId)
    drag(false)
  }

  return (
    <>
      <group position={[0, 2.8, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? "kinematicPosition" : "dynamic"}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={3.5}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={handlePointerUp}
            onPointerDown={handlePointerDown}
          >
            <mesh geometry={nodes.card?.geometry}>
              <meshPhysicalMaterial
                map={cardDesignTexture}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.5}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip?.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp?.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={bandRef}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <meshLineMaterial
          color={new THREE.Color(0x000000)}
          depthTest={false}
          resolution={[width, height]}
          useMap={true}
          map={lanyardStrapTexture}
          repeat={[-4, 1]}
          lineWidth={0.03}
          transparent={true}
          alphaTest={0.1}
        />
      </mesh>
    </>
  )
}
