import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GiveKudo from "./pages/GiveKudo";
import { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  // optional: keep token in sync if storage changes
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem("access_token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <BrowserRouter>
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route
          path="/login"
          element={<Login setToken={setToken} />}
        />
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/give-kudo"
          element={token ? <GiveKudo /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
