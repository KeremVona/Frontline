import { use, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect } from "react";
import { parse } from "dotenv";
import HostGame from "./pages/HostGame";
import GameDetails from "./pages/GameDetails";
import GameList from "./pages/GameList";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    console.log("is auth");
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("http://localhost:5000/auth/is-verify", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const parseRes = await response.json();

        console.log(`parseRes: ${parseRes}`);

        setIsAuthenticated(parseRes === true);
      } catch (err) {
        console.log("error");
        console.error(err.message);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    isAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        🔄 Checking authentication...
      </div>
    );
  }

  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login setAuth={setAuth} />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Register setAuth={setAuth} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Dashboard setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/host-game"
              element={
                isAuthenticated ? <HostGame /> : <Navigate to="/login" />
              }
            />
            <Route path="/games/:id" element={<GameDetails />} />
            <Route
              path="/games"
              element={
                isAuthenticated ? <GameList /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
