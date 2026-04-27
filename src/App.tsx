import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WalletDashboard from "./pages/WalletDashboard";
import PrivyGate from "./components/PrivyGate";

export default function App() {
  return (
    <PrivyGate>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/wallet" element={<WalletDashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </PrivyGate>
  );
}

