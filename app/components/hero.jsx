"use client";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useTexture,
  useAnimations,
} from "@react-three/drei";
import * as THREE from "three";

const Hero = () => {
  // Load the Model
  const { scene: modelScene, animations } = useGLTF("/models/dog.drc.glb");

  useThree(({ camera }) => {
    camera.position.z = 0.48;
  });

  // Model Animation
  const { actions } = useAnimations(animations, modelScene);

  useEffect(() => {
    if (actions["Take 001"]) {
      actions["Take 001"].play();
    }
  }, [actions]);

  // Load textures
  const [normalMap, matcapTexture, branchesDiffuse, branchesNormal] = useTexture([
    "/dog_normals.jpg",
    "/matcap/mat-2.png",
    "/models/branches_diffuse.jpg",
    "/models/branches_normals.jpg",
  ]).map((texture) => {
    texture.flipY = false;
    return texture;
  });

  // Apply material
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
        // Adjust this name to match your model
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