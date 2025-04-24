import { parse } from 'dotenv';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';

export default function Dashboard({ setAuth }) {
  const [name, setName] = useState("");

  async function getName() {
    try {
      const respone = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: { token: localStorage.token }
      });

      const parseRes = await respone.json();
      setName(parseRes.username);
    }
    catch (err) {
      console.error(err.message);
    }
  }

  const sifir = async () => {
    try {
    const respone = await fetch("http://localhost:5000/dashboard", {
      method: "POST",
      headers: { token: "" }
    });
  }
  catch (err) {
    console.error(err.message);
  }
  }

  useEffect(() => {
    getName();
  }, []);

  return (
    <>
      <h1>Dashboard {name}</h1>
      <button onClick={sifir}>Logout</button>
    </>
  );
}
