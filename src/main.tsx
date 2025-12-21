import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);

// Service Worker uniquement en production
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
      (registration) => {
        console.log("✅ Service Worker enregistré:", registration);
      },
      (error) => {
        console.error("❌ Erreur Service Worker:", error);
      }
    );
  });
}
