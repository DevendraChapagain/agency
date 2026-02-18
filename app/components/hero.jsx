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

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Hero = () => {
  const { scene: modelScene, animations } = useGLTF("/models/dog.drc.glb");
  const dogModelRef = useRef();
  const materialRef = useRef();

  useThree(({ camera }) => {
    camera.position.z = 0.42;
  });

  const { actions } = useAnimations(animations, modelScene);

  useEffect(() => {
    if (actions["Take 001"]) {
      actions["Take 001"].play();
    }
  }, [actions]);

  // Load textures
  const [normalMap, matcapTexture, branchesDiffuse, branchesNormal] =
    useTexture([
      "/dog_normals.jpg",
      "/matcap/mat-2.png",
      "/models/branches_diffuse.jpg",
      "/models/branches_normals.jpg",
    ]).map((texture) => {
      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    });

  const matcaps = useTexture([
    "/matcap/mat-1.png",
    "/matcap/mat-2.png",
    "/matcap/mat-3.png",
    "/matcap/mat-4.png",
    "/matcap/mat-5.png",
    "/matcap/mat-6.png",
    "/matcap/mat-7.png",
    "/matcap/mat-8.png",
    "/matcap/mat-9.png",
    "/matcap/mat-10.png",
    "/matcap/mat-11.png",
    "/matcap/mat-12.png",
    "/matcap/mat-13.png",
    "/matcap/mat-14.png",
    "/matcap/mat-15.png",
    "/matcap/mat-16.png",
    "/matcap/mat-17.png",
    "/matcap/mat-18.png",
    "/matcap/mat-19.png",
    "/matcap/mat-20.png",
  ]).map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  // Apply materials with custom shader
  useEffect(() => {
    const dogMaterial = new THREE.MeshMatcapMaterial({
      normalMap: normalMap,
      matcap: matcaps[1],
    });

    dogMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uMatcapTexture1 = { value: matcaps[18] };
      shader.uniforms.uMatcapTexture2 = { value: matcaps[1] };
      shader.uniforms.uProgress = { value: 1.0 };

      materialRef.current = shader.uniforms;

      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;
        void main() {
        `,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "vec4 matcapColor = texture2D( matcap, uv );",
        `
        vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
        vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
        float transitionFactor = 0.2;
        float progress = smoothstep(
          uProgress - transitionFactor,
          uProgress,
          (vViewPosition.x + vViewPosition.y) * 0.5 + 0.5
        );
        vec4 matcapColor = mix(matcapColor2, matcapColor1, progress);
        `,
      );
    };

    dogMaterial.needsUpdate = true;

    const branchMaterial = new THREE.MeshStandardMaterial({
      map: branchesDiffuse,
      normalMap: branchesNormal,
    });

    modelScene.traverse((child) => {
      if (child.isMesh) {
        if (child.name.includes("DOG")) {
          child.material = dogMaterial;
        } else if (child.name.includes("BRANCH")) {
          child.material = branchMaterial;
        }
      }
    });

    return () => {
      dogMaterial.dispose();
      branchMaterial.dispose();
    };
  }, [modelScene, normalMap, matcaps, branchesDiffuse, branchesNormal]);

  // GSAP scroll animation
  useGSAP(() => {
    if (!dogModelRef.current) return;

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
        "third",
      )
      .to(
        dogModelRef.current.position,
        {
          x: "-=0.5",
          z: "+=0.6",
          y: "-=0.05",
        },
        "third",
      );
  }, []);

  // Hover events
  useEffect(() => {
    const changeMaterial = (matcap) => {
      if (!materialRef.current) return;

      materialRef.current.uMatcapTexture1.value = matcap;

      gsap.to(materialRef.current.uProgress, {
        value: 0.0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          materialRef.current.uMatcapTexture2.value = matcap;
          materialRef.current.uProgress.value = 1.0;
        },
      });
    };

    const materialMap = {
      tomorrowland: matcaps[18],
      "navy-pier": matcaps[7],
      "msi-chicago": matcaps[8],
      "this-was-louises-phone": matcaps[11],
      kikk: matcaps[9],
      "the-kennnedy-center": matcaps[7],
      "royal-opera-of-willonia": matcaps[12],
    };

    const listeners = [];

    Object.entries(materialMap).forEach(([id, matcap]) => {
      const element = document.querySelector(`[img-title="${id}"]`);
      if (element) {
        const handler = () => changeMaterial(matcap);
        element.addEventListener("mouseenter", handler);
        listeners.push({ element, handler });
      }
    });

    const titlesContainer = document.querySelector(".titles");
    const resetHandler = () => changeMaterial(matcaps[1]);

    if (titlesContainer) {
      titlesContainer.addEventListener("mouseleave", resetHandler);
    }

    return () => {
      listeners.forEach(({ element, handler }) => {
        element.removeEventListener("mouseenter", handler);
      });
      if (titlesContainer) {
        titlesContainer.removeEventListener("mouseleave", resetHandler);
      }
    };
  }, [matcaps]);

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
