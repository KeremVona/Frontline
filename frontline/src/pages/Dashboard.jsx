import { parse } from 'dotenv';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Header from "../components/Header"

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

  useEffect(() => {
    getName();
  }, []);

  const logout = async e => {
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
      <Header name={name}/>
      {/*<button className='bg-amber-100' onClick={e => logout(e)}>Logout</button>*/}
    </>
  );
}
