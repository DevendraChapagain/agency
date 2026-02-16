"use client";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useTexture,
  useAnimations,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Activated GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const Hero = () => {
  // Model Loaded
  const { scene: modelScene, animations } = useGLTF("/models/dog.drc.glb");

  // Create ref for the model
  const dogModelRef = useRef();

  useThree(({ camera }) => {
    camera.position.z = 0.55;
  });

  // Model Animation
  const { actions } = useAnimations(animations, modelScene);

  useEffect(() => {
    if (actions["Take 001"]) {
      actions["Take 001"].play();
    }
  }, [actions]);

  // Textures Loaded
  const [normalMap, matcapTexture, branchesDiffuse, branchesNormal] =
    useTexture([
      "/dog_normals.jpg",
      "/matcap/mat-2.png",
      "/models/branches_diffuse.jpg",
      "/models/branches_normals.jpg",
    ]).map((texture) => {
      texture.flipY = false;
      return texture;
    });

  // GSAP Animation
  useGSAP(() => {
    if (!dogModelRef.current) return; // Safety check

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-1",
        endTrigger: "#section-3",
        start: "top top",
        end: "bottom bottom",
        markers: true,
        scrub: true,
      },
    });

    tl.to(dogModelRef.current.position, {
      z: "-=0.75",
      y: "+=0.1",
    })
      .to(dogModelRef.current.rotation, {
        x: `+=${Math.PI / 15}`,
      })
      .to(
        dogModelRef.current.rotation,
        {
          y: `-=${Math.PI}`,
        },
        "third"
      )
      .to(
        dogModelRef.current.position,
        {
          x: "-=0.5",
          z: "+=0.6",
          y: "-=0.05",
        },
        "third"
      );
  }, []);

  // Material Applied
  useEffect(() => {
    const dogMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
      normalMap: normalMap,
    });

    const branchMaterial = new THREE.MeshStandardMaterial({
      map: branchesDiffuse,
      normalMap: branchesNormal,
    });

    modelScene.traverse((child) => {
      if (child.name.includes("DOG")) {
        child.material = dogMaterial;
      } else if (child.name.includes("BRANCH")) {
        child.material = branchMaterial;
      }
    });

    // Cleanup
    return () => {
      dogMaterial.dispose();
      branchMaterial.dispose();
    };
  }, [modelScene, normalMap, matcapTexture, branchesDiffuse, branchesNormal]);

  return (
    <>
      <primitive
        ref={dogModelRef}
        object={modelScene}
        position={[0.2, -0.6, 0]}
        rotation={[0, Math.PI / 5.8, 0]}
      />
      <directionalLight position={[0, 5, 5]} intensity={10} />
      <ambientLight intensity={0.5} />
      <OrbitControls />
    </>
  );
};

export default Hero;