import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/store";
import { defaultTheme, Provider as SpectrumProvider } from "@adobe/react-spectrum";

const rootContainer = document.getElementById("root");
const root = createRoot(rootContainer!);
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <SpectrumProvider theme={defaultTheme}>
        <App />
      </SpectrumProvider>
    </ReduxProvider>
  </React.StrictMode>
);
