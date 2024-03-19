import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "./store/store";
import { defaultTheme, Provider as SpectrumProvider } from "@adobe/react-spectrum";
import { PersistGate } from "redux-persist/integration/react";

const rootContainer = document.getElementById("root");
const root = createRoot(rootContainer!);
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SpectrumProvider theme={defaultTheme}>
          <App />
        </SpectrumProvider>
      </PersistGate>
    </ReduxProvider>
  </React.StrictMode>
);
