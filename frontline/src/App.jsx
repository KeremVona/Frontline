import { use, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { useEffect } from 'react';
import { parse } from 'dotenv';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  }

  async function isAuth() {
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.token }
      });

      const parseRes = await response.json();
      
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    }
    catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    isAuth();
  })
  
  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setAuth={setAuth} />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register setAuth={setAuth} />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
