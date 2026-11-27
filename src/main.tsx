import React from "react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { AppProvider } from "./app/providers/AppProvider";
import AppRouter from "./app/router/AppRouter";
import "./styles/globals.css";
import "./styles/adventure.css";

const Router = import.meta.env.MODE === "pages" ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </Router>
  </React.StrictMode>,
);
