import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateWallet, usePrivy, useWallets } from "@privy-io/react-auth";

function shortAddr(addr: string) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";
}

export default function WalletDashboard() {
  const navigate = useNavigate();
  const { ready, authenticated, user, logout } = usePrivy();
  const { wallets } = useWallets();
  const { createWallet } = useCreateWallet();
  const [creatingWallet, setCreatingWallet] = useState(false);
  const [createWalletError, setCreateWalletError] = useState<string | null>(null);

  const linkedWallets =
    user?.linkedAccounts?.filter(
      (a: any) => a?.type === "wallet" || a?.type === "smart_wallet",
    ) ?? [];

  const embeddedWallet =
    linkedWallets.find((w: any) => w?.walletClientType === "privy" || w?.connectorType === "embedded") ??
    linkedWallets[0];

  const address =
    embeddedWallet?.address ||
    wallets?.[0]?.address ||
    "";
  const hasEmbeddedWallet = Boolean(address);

  const polygonScanBaseUrl =
    (import.meta.env.VITE_POLYGONSCAN_BASE_URL as string | undefined)?.trim() ||
    "https://polygonscan.com";
  const walletExplorerUrl = address ? `${polygonScanBaseUrl}/address/${address}` : "";

  if (ready && !authenticated) {
    return (
      <div className="page">
        <div className="card">
          <h1>Non connecté</h1>
          <p className="muted">Connecte-toi pour voir ton wallet embedded.</p>
          <Link className="btn" to="/login">
            Aller au login
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleCreateWallet = async () => {
    setCreateWalletError(null);
    setCreatingWallet(true);
    try {
      await createWallet();
    } catch (error) {
      setCreateWalletError(
        error instanceof Error ? error.message : "Impossible de creer un wallet embedded.",
      );
    } finally {
      setCreatingWallet(false);
    }
  };

  useEffect(() => {
    if (!ready || !authenticated || hasEmbeddedWallet || creatingWallet) return;
    void handleCreateWallet();
    // Intentionally run when auth/wallet state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, authenticated, hasEmbeddedWallet]);

  return (
    <div className="page">
      <div className="card">
        <div className="badge">Privy POC - Wallet Dashboard</div>
        <h1>Wallet dashboard</h1>
        <p className="muted">
          Si `createOnLogin` est activé, Privy crée un wallet embedded automatiquement pour les utilisateurs sans wallet.
        </p>
        {address ? (
          <p className="status">
            <span className="dot" />
            Wallet embedded prêt
          </p>
        ) : null}

        {!ready ? <p className="muted">Chargement…</p> : null}

        <div className="section">
          <div className="kv">
          <div className="k">User</div>
          <div className="v">{user?.id ?? "—"}</div>
          <div className="k">Email</div>
          <div className="v">{user?.email?.address ?? "—"}</div>
          <div className="k">Wallet (address)</div>
          <div className="v mono">{address || "—"}</div>
        </div>

        <div className="row">
          {address ? (
            <a
              className="btn secondary"
              href={walletExplorerUrl}
              target="_blank"
              rel="noreferrer"
            >
              Voir sur explorer ({shortAddr(address)})
            </a>
          ) : (
            <button className="btn secondary" disabled={creatingWallet} onClick={handleCreateWallet}>
              {creatingWallet ? "Creation du wallet..." : "Creer wallet embedded"}
            </button>
          )}
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        </div>

        {createWalletError ? <div className="error">{createWalletError}</div> : null}

        <details style={{ marginTop: 16 }}>
          <summary>Debug: linkedAccounts / wallets</summary>
          <pre className="pre">{JSON.stringify({ linkedWallets, wallets }, null, 2)}</pre>
        </details>

        {walletExplorerUrl ? (
          <p className="muted" style={{ marginTop: 12 }}>
            URL PolygonScan: <a href={walletExplorerUrl} target="_blank" rel="noreferrer">{walletExplorerUrl}</a>
          </p>
        ) : null}
      </div>
    </div>
  );
}

