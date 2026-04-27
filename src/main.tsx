import React from "react";
import ReactDOM from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./styles.css";

const appId = import.meta.env.VITE_PRIVY_APP_ID as string | undefined;
const clientId = import.meta.env.VITE_PRIVY_CLIENT_ID as string | undefined;

if (!appId || !clientId) {
  // eslint-disable-next-line no-console
  console.warn(
    "Missing VITE_PRIVY_APP_ID or VITE_PRIVY_CLIENT_ID. Copy .env.example to .env and fill values.",
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PrivyProvider
        appId={appId || ""}
        clientId={clientId || ""}
        config={{
          loginMethods: ["email"],
          embeddedWallets: {
            ethereum: {
              // creates an embedded wallet automatically for users without one
              createOnLogin: "users-without-wallets",
            },
          },
        }}
      >
        <App />
      </PrivyProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

