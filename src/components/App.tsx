import React from "react";
import { Canvas } from "./Canvas";
import { Panel } from "./Panel";

export function App() {
  return (
    <main className="h-screen overflow-hidden">
      <Canvas />
      <Panel />
    </main>
  );
}
