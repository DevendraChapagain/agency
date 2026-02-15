"use client"

import { Canvas } from "@react-three/fiber";
import Hero from "./components/hero";

export default function App() {
  return (
    <Canvas>
      <Hero />
    </Canvas>
  );
};