import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginWithEmail, usePrivy } from "@privy-io/react-auth";

/**
 * Privy crée généralement le wallet embedded "à l'authentification".
 * Dans ce POC, Register = même flow OTP que Login, mais présenté comme "inscription".
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { ready } = usePrivy();
  const { sendCode, loginWithCode } = useLoginWithEmail();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

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

  const handleRegister = async () => {
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
        <div className="badge">Privy POC - Embedded Wallet Onboarding</div>
        <h1>Register (Privy)</h1>
        <p className="muted">
          Inscription via email OTP. Après validation, Privy crée automatiquement un wallet embedded si nécessaire.
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
              <button className="btn" disabled={!ready || busy || code.trim().length < 4} onClick={handleRegister}>
                {busy ? "Création…" : "Créer le compte"}
              </button>
            </div>
          </div>
        )}

        {error ? <div className="error">{error}</div> : null}

        <p className="muted">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

