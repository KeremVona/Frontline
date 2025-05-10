import React from "react";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

export default function Profile({ setAuth }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function getName() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const parsedResponse = await response.json();
        setName(parsedResponse.username); // Make sure you're receiving the data correctly
      } else {
        console.error("Server responded with error:", response.status);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getName();
  }, []);

  /*
  async function getInformation() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/auth/get-information", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }), // Send them here
      });

      if (response.ok) {
        const parsedResponse = await response.json();
        console.log(parsedResponse);
        setEmail(parsedResponse.email);
      } else {
        console.error("Server responded with error:", response.status);
      }
    } catch (err) {
      console.error(err.message);
    }
  }
  getInformation();
  */

  const logout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <>
      <Navbar />

      <div className="p-6 max-w-2xl bg-gray-500 mt-4 shadow-md rounded-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="mb-1">
          <strong>Username: </strong> {name}
        </p>
        <button className="btn btn-sm" onClick={logout}>
          Log out
        </button>

        {/*<h2 className="text-xl font-semibold mt-4 mb-2">General Rules</h2>*/}
        {/*<ul className="list-disc list-inside"></ul>*/}
      </div>
    </>
  );
}
