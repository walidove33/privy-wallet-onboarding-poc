import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginWithEmail, usePrivy } from "@privy-io/react-auth";

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const safeName = name.length <= 2 ? `${name[0] ?? ""}*` : `${name.slice(0, 2)}***`;
  return `${safeName}@${domain}`;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { ready, authenticated } = usePrivy();
  const { sendCode, loginWithCode } = useLoginWithEmail();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  if (ready && authenticated) {
    return (
      <div className="page">
        <div className="card">
          <h1>Déjà connecté</h1>
          <p>Tu peux accéder à ton wallet embedded.</p>
          <button className="btn" onClick={() => navigate("/wallet")}>
            Aller au dashboard wallet
          </button>
        </div>
      </div>
    );
  }

  const handleSendCode = async () => {
    setError(null);
    setBusy(true);
    try {
      await sendCode({ email: normalizedEmail });
      setPhase("code");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible d'envoyer le code.");
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = async () => {
    setError(null);
    setBusy(true);
    try {
      await loginWithCode({ code: code.trim(), email: normalizedEmail });
      navigate("/wallet");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Code invalide ou expiré.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="badge">Privy POC - Authentication</div>
        <h1>Login (Privy)</h1>
        <p className="muted">
          Connexion par email OTP. Un wallet embedded sera créé automatiquement si l'utilisateur n'en a pas.
        </p>

        {!ready ? <p className="muted">Chargement Privy…</p> : null}

        {phase === "email" ? (
          <div className="section">
            <label className="label">
              Email
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                type="email"
              />
            </label>
            <button className="btn" disabled={!ready || busy || !normalizedEmail} onClick={handleSendCode}>
              {busy ? "Envoi…" : "Envoyer le code"}
            </button>
          </div>
        ) : (
          <div className="section">
            <p className="muted">Code envoyé à {maskEmail(normalizedEmail)}</p>
            <label className="label">
              Code OTP
              <input
                className="input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                inputMode="numeric"
              />
            </label>
            <div className="row">
              <button className="btn secondary" disabled={busy} onClick={() => setPhase("email")}>
                Changer email
              </button>
              <button className="btn" disabled={!ready || busy || code.trim().length < 4} onClick={handleLogin}>
                {busy ? "Connexion…" : "Se connecter"}
              </button>
            </div>
          </div>
        )}

        {error ? <div className="error">{error}</div> : null}

        <p className="muted">
          Pas de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}

