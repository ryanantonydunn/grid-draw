import React from "react";
import { Canvas } from "./Canvas";
import { Panel } from "./Panel";
import { LineEditor } from "./LineEditor";

export function App() {
  return (
    <main className="h-screen overflow-hidden">
      <Canvas />
      <LineEditor />
      <Panel />
    </main>
  );
}
