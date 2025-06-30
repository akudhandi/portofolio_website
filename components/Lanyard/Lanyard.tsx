/* eslint-disable react/no-unknown-property */
"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

// Catatan: Deklarasi global untuk JSX (declare global) telah dipindahkan ke file types/meshline.d.ts
// Pastikan file types/meshline.d.ts ada di proyek Anda dan berisi deklarasi yang benar.
// Contoh: PORTOFOLIO_WEBSITE_REACT/types/meshline.d.ts

// Extend MeshLine into Fiber (ini harus setelah declare global dan import)
extend({ MeshLineGeometry, MeshLineMaterial });

// Asset paths (pastikan path ini benar dari folder `public`)
const cardGLB = "/assets/lanyard/card.glb"; 
const lanyardStrapTexturePath = "/assets/lanyard/lanyard.png"; // Untuk tali lanyard
const cardDesignTexturePath = "/assets/lanyard/card lanyard.png"; // Untuk desain kartu

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
}

// Komponen utama Lanyard (Canvas dan Physics setup)
export default function Lanyard({
  position = [0, 0, 7], // Sesuaikan posisi kamera awal (Z=7 adalah titik awal yang baik)
  gravity = [0, -20, 0], // Gravitasi standar
  fov = 50, // Field of View
  transparent = true, // Default transparan
}: LanyardProps) {
  return (
    // Div pembungkus untuk mengontrol ukuran dan background CSS
    <div className="relative z-0 w-full h-screen flex justify-center items-center">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position, fov }}
        // Mengatur clear color WebGL untuk transparansi background
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        {/* Lingkungan dan pencahayaan global */}
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

        {/* Pencahayaan tambahan (jika preset environment belum cukup) */}
        <ambientLight intensity={1.5} /> {/* Cahaya ambient */}
        <directionalLight position={[5, 5, 5]} intensity={1} /> {/* Cahaya directional */}

        {/* Physics engine untuk simulasi lanyard */}
        <Physics gravity={gravity} timeStep={1 / 60}>
          <Band /> {/* Komponen Band yang berisi model lanyard dan fisika */}
        </Physics>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
}

// Komponen Band (model 3D dan interaksi)
function Band({ maxSpeed = 50, minSpeed = 0 }: BandProps) {
  const bandRef = useRef<THREE.Mesh>(null); // Ref untuk mesh tali lanyard
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: any = {
    type: "dynamic" as RigidBodyProps["type"],
    canSleep: true,
    colliders: false, // Colliders tidak akan terlihat secara visual
    angularDamping: 4,
    linearDamping: 4,
  };

  // Load GLB model dan tekstur
  const { nodes, materials } = useGLTF(cardGLB) as any;
  const lanyardStrapTexture = useTexture(lanyardStrapTexturePath); // Tekstur untuk tali
  const cardDesignTexture = useTexture(cardDesignTexturePath); // Tekstur untuk desain kartu

  // Mendapatkan ukuran kanvas dari useThree hook
  const { width, height } = useThree((state) => state.size);

  // Curve untuk MeshLine (tali lanyard)
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  // Fix texture orientation and wrapping
  useEffect(() => {
    if (cardDesignTexture) {
      cardDesignTexture.flipY = false; // Mencegah tekstur kartu terbalik
      cardDesignTexture.needsUpdate = true;
    }
    if (lanyardStrapTexture) {
      lanyardStrapTexture.wrapS = lanyardStrapTexture.wrapT = THREE.RepeatWrapping; // Mengulang tekstur tali
      lanyardStrapTexture.needsUpdate = true;
    }
  }, [cardDesignTexture, lanyardStrapTexture]);

  // Setup rope joints untuk fisika tali
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0], // Titik attachment kartu ke tali
  ]);

  // Efek hover untuk cursor
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  // Loop animasi per frame
  useFrame((state, delta) => {
    // Logika drag objek
    if (dragged && typeof dragged !== "boolean") {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    // Update posisi titik-titik tali dan geometri MeshLine
    if (fixed.current && bandRef.current) { // Pastikan bandRef.current ada
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      // Update band geometry (akses melalui bandRef.current.geometry)
      (bandRef.current.geometry as InstanceType<typeof MeshLineGeometry>).setPoints(curve.getPoints(32));

      // Update rotasi kartu
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      // === PERBAIKAN SINTAKS KRUSIAL DI SINI ===
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }); 
    }
  });

  curve.curveType = "chordal";

  return (
    <>
      {/* Grup untuk RigidBody (fisika) dari tali dan kartu */}
      {/* Sesuaikan posisi Y untuk menggeser lanyard ke atas/bawah */}
      <group position={[0, 2.8, 0]}> 
        <RigidBody
          ref={fixed}
          {...segmentProps}
          type={"fixed" as RigidBodyProps["type"]} // Titik tetap (digantung)
        />
        <RigidBody
          position={[0.5, 0, 0]}
          ref={j1}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1, 0, 0]}
          ref={j2}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.5, 0, 0]}
          ref={j3}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={
            dragged
              ? ("kinematicPosition" as RigidBodyProps["type"])
              : ("dynamic" as RigidBodyProps["type"])
          }
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={3.5} // Skala kartu, sesuaikan jika terlalu besar/kecil
            position={[0, -1.2, -0.05]} // Posisi kartu relatif terhadap titik gantungnya
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                // === PENTING: GUNAKAN TEKSTUR DESAIN KARTU YANG DIMUAT ===
                map={cardDesignTexture} // Menggunakan tekstur dari card lanyard.png
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.5} // Sesuaikan roughness untuk tampilan material
                metalness={0.8}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      {/* Render the rope/band using MeshLine */}
      <mesh ref={bandRef}> {/* Menggunakan bandRef di sini */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <meshLineGeometry /> 
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <meshLineMaterial
          // Warna ini akan menjadi fallback jika tekstur gagal atau transparan
          color={new THREE.Color(0x000000)} // Hitam atau warna lain sesuai keinginan
          depthTest={false}
          resolution={[width, height]} // Menggunakan width/height dari useThree
          useMap={true} // Mengaktifkan penggunaan tekstur
          map={lanyardStrapTexture} // Tekstur untuk tali lanyard
          repeat={[-4, 1]}
          // === PENTING: LEBAR TALI LANYARD ===
          // Sesuaikan nilai ini untuk mendapatkan ketebalan yang diinginkan.
          // Coba nilai-nilai seperti 0.02, 0.03, 0.04, 0.05
          lineWidth={0.03} // Misalnya, dimulai dengan 0.03
          transparent={true} // Penting untuk tekstur dengan alpha channel
          alphaTest={0.1} // Ambang batas transparansi
        />
      </mesh>
    </>
  );
}