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
        <div id="column-1" className="ml-10 mt-5 bg-[#313244]">
          <Header name={name} />
          <button className="bg-amber-100" onClick={(e) => logout(e)}>
            Logout
          </button>

          <ul className="grid grid-cols-2 mt-20 gap-5">
            <li className="text-2xl bg-amber-200 p-2.5 flex justify-center">
              <Link
                to="/host-game"
                className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
              >
                Host Game
              </Link>
            </li>
            <li className="text-2xl bg-amber-200 p-2.5 flex justify-center">
              <Link
                to="/games"
                className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
              >
                Game List
              </Link>
            </li>
            <li className="text-2xl bg-amber-200 p-2.5 flex justify-center">
              <p className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
                Friends
              </p>
            </li>
            <li className="text-2xl bg-amber-200 p-2.5 flex justify-center">
              <p className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">
                Clan
              </p>
            </li>
          </ul>
        </div>
        <div id="column-2" className="mr-10 mt-5 bg-[#313244]">
          <h2 className="text-4xl p-4 mb-20" id="dashboard">
            Dashboard
          </h2>

          <div className="grid grid-cols-2 gap-2">
            <div className="" id="stats">
              <div className="stats stats-vertical shadow">
                <div className="stat">
                  <div className="stat-title">Games played</div>
                  <div className="stat-value">10</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Wins</div>
                  <div className="stat-value">5</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Losses</div>
                  <div className="stat-value">5</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Draws</div>
                  <div className="stat-value">0</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Most Played</div>
                  <div className="stat-value">Text</div>
                </div>
              </div>
            </div>
            <div className="" id="news">
              <h2 className="text-3xl ml-2">News</h2>
              <div className="card card-border bg-base-100 w-96 mt-4 ml-5">
                <div className="card-body">
                  <h2 className="card-title">Version 0.1 Out</h2>
                  <p>
                    You can host and find games! Join and Leave buttons work.
                    Player count updates.
                  </p>
                  <div className="card-actions justify-end">
                    {/*<button className="btn btn-primary">Read now</button>*/}
                  </div>
                </div>
              </div>
              <div className="card card-border bg-base-100 w-96 mt-4 ml-5">
                <div className="card-body">
                  <h2 className="card-title">Version 0.2 Out</h2>
                  <p>
                    You can chat in lobbies!
                  </p>
                  <div className="card-actions justify-end">
                    {/*<button className="btn btn-primary">Read now</button>*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
