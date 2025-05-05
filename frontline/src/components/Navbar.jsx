import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  let theURL = window.location.href;
  let dashboard = theURL.includes("/dashboard") ? true : false;
  let gameHost = theURL.includes("/host-game") ? true : false;
  let games = theURL.includes("/games") ? true : false;
  let profile = theURL.includes("/profile") ? true : false;
  return (
    <ul className="flex flex-row  justify-center gap-2 bg-[#1e1e2f] text-[#f1f1f1] border-b border-[#2d7d46]">
      <li className={`${dashboard ? "basis-sm bg-[#2d7d46] justify-center items-center flex p-2.5" : "basis-sm bg-amber-200 justify-center items-center flex p-2.5"}`}>
        {/*<Link to="/dashboard" className='text-center text-2xl text-black'>Dashboard</Link>*/}

        <Link
          to="/dashboard"
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl hover:bg-[#2d7d46] transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Dashboard
        </Link>
        {/* bg-[#2d7d46] text-white hover:bg-[#3ba55d] rounded px-4 py-2 */}
      </li>
      <li className={`${gameHost ? "basis-sm bg-[#2d7d46] justify-center items-center flex p-2.5" : "basis-sm bg-amber-200 justify-center items-center flex p-2.5"}`}>
        <Link
          to="/host-game"
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl hover:bg-[#2d7d46] transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Game Host
        </Link>
      </li>
      <li className={`${games ? "basis-sm bg-[#2d7d46] justify-center items-center flex p-2.5" : "basis-sm bg-amber-200 justify-center items-center flex p-2.5"}`}>
        <Link
          to="/games"
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl hover:bg-[#2d7d46] transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Game List
        </Link>
      </li>
      <li className={`${profile ? "basis-sm bg-[#2d7d46] justify-center items-center flex p-2.5" : "basis-sm bg-amber-200 justify-center items-center flex p-2.5"}`}>
        <Link
          to=""
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl hover:bg-[#2d7d46] transition"
        >
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
            </div>
          </div>
          Profile
        </Link>
      </li>
    </ul>
  );
}
