"use client"

import { Canvas } from "@react-three/fiber";
import Hero from "./components/hero";

export default function App() {
  return (
    <main>
      <Canvas
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          backgroundImage: 'url("/background-xl.png")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <Hero />
      </Canvas>
      <section id="section_1"> </section>
      <section id="section_2"> </section>
      <section id="section_3"> </section>
    </main>
  );
};