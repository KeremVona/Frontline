import { parse } from "dotenv";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard({ setAuth }) {
  const [name, setName] = useState("");

  async function getName() {
    try {
      const respone = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await respone.json();
      setName(parseRes.username);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getName();
  }, []);

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
      <div className="grid grid-cols-2 gap-20">
        <div id="column-1" className="ml-10 mt-5">
          <Header name={name} />
          {/*<button className='bg-amber-100' onClick={e => logout(e)}>Logout</button>*/}

          <ul className="grid grid-cols-2 mt-20 gap-5">
            <li className="">
              <Link to="" className="">
                <p className="text-2xl bg-amber-200 p-2.5">Host Game</p>
              </Link>
            </li>
            <li>
              <Link to="" className="">
                <p className="text-2xl bg-amber-200 p-2.5">Game List</p>
              </Link>
            </li>
            <li>
              <p className="text-2xl bg-amber-200 p-2.5">Friends</p>
            </li>
            <li>
              <p className="text-2xl bg-amber-200 p-2.5">Clan</p>
            </li>
          </ul>
        </div>
        <div id="column-2" className="mr-10 mt-5">
          <h2 className="text-4xl p-4 mb-20" id="dashboard">
            Dashboard
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid grid-rows-5 gap-5" id="stats">
              <p className="text-2xl">Number of games played</p>
              <p className="text-2xl">Wins</p>
              <p className="text-2xl">Losses</p>
              <p className="text-2xl">Draws</p>
              <p className="text-2xl">Most played</p>
            </div>
            <div className="" id="news">
              <h2 className="text-3xl">News</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
