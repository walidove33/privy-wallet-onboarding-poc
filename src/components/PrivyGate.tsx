import { PropsWithChildren } from "react";
import { usePrivy } from "@privy-io/react-auth";

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="kv" style={{ marginTop: 10 }}>
      <div className="k">{k}</div>
      <div className="v mono">{v}</div>
    </div>
  );
}

export default function PrivyGate({ children }: PropsWithChildren) {
  const { ready } = usePrivy();

  const appId = import.meta.env.VITE_PRIVY_APP_ID || "";
  const clientId = import.meta.env.VITE_PRIVY_CLIENT_ID || "";

  if (!appId || !clientId) {
    return (
      <div className="page">
        <div className="card">
          <h1>Configuration manquante</h1>
          <p className="muted">
            Privy ne peut pas s&apos;initialiser sans <span className="mono">VITE_PRIVY_APP_ID</span> et{" "}
            <span className="mono">VITE_PRIVY_CLIENT_ID</span>.
          </p>
          <p className="muted">
            Crée un fichier <span className="mono">privy-poc/.env</span> (à partir de{" "}
            <span className="mono">.env.example</span>) puis redémarre <span className="mono">npm run dev</span>.
          </p>
          <InfoRow k="VITE_PRIVY_APP_ID" v={appId ? "OK (set)" : "MISSING"} />
          <InfoRow k="VITE_PRIVY_CLIENT_ID" v={clientId ? "OK (set)" : "MISSING"} />
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="page">
        <div className="card">
          <h1>Chargement Privy…</h1>
          <p className="muted">
            Si ça reste bloqué ici, la cause la plus fréquente est un domaine non autorisé dans le dashboard Privy.
          </p>
          <p className="muted">
            Ajoute <span className="mono">http://localhost:5174</span> dans la liste des <b>Allowed origins</b> (ou
            Domains) de ton app Privy, puis recharge la page.
          </p>
          <InfoRow k="Origin détectée" v={window.location.origin} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

