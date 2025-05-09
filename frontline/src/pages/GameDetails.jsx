import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import io from "socket.io-client";
import Chat from "../components/Chat";

const socket = io.connect("http://localhost:5000");

const GameDetails = () => {
  const { id: gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isoDate, setIsoDate] = useState(null);
  const [time1, setTime1] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);
  const [userId, setUserId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [textToCopy, setTextToCopy] = useState("");

  // Fetch user info (or adjust if you get userId another way)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5000/dashboard", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        console.log("Fetched dashboard data:", data);
        setUsername(data.username);
        setUserId(data.user_id);
      } catch (err) {
        console.error("Failed to fetch user:", err.message);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchGameDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`/api/games/${gameId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch game.");

        const data = await response.json();

        const isoDate = data.game_time;
        setIsoDate(data.game_time);
        const date1 = new Date(isoDate);

        const time1 = date1.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
        setTime1(time1);
        setTextToCopy(data.invite);

        // console.log(`data: ${data.game_time}`);
        setGame(data);
        setRoom(data.id);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  // Fetch current player count
  const fetchPlayerCount = async () => {
    try {
      const res = await fetch(`/api/games/${gameId}/playerCount`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setPlayerCount(data.count);
      } else {
        console.error("Failed to fetch player count:", data.error);
      }
    } catch (err) {
      console.error("Failed to fetch player count:", err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/games/${gameId}/players`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setPlayers(data.players);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Failed to fetch players:", err);
    }
  };

  useEffect(() => {
    fetchPlayerCount();
    fetchPlayers();
  }, [gameId]);

  // Join game
  const handleJoin = async () => {
    console.log("join içi");
    try {
      const res = await fetch("/api/games/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ gameId, userId }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("resok");
        setPlayerCount(data.playerCount);
        setHasJoined(true);
        fetchPlayers();
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Join failed:", err);
    }
  };

  // Leave game
  const handleLeave = async () => {
    try {
      const res = await fetch("/api/games/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ gameId, userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setPlayerCount(data.playerCount);
        setHasJoined(false);
        fetchPlayers();
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Leave failed:", err);
    }
  };

  function hasPlayer(username) {
    return players.some((player) => player.username === username);
  }

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      if (hasPlayer(username)) {
        setShowChat(true);
      } else {
        return (
          <>
            <alert></alert>
            <div role="alert" className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Warning: Invalid email address!</span>
            </div>
          </>
        );
      }
      socket.emit("join_room", room);
    }
  };

  const hideChat = () => {
    setShowChat(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  if (loading) return <p className="p-4">Loading game...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-2">
        <div className="p-6 max-w-2xl bg-gray-500 mt-4 shadow-md rounded-xl ml-10">
          <h1 className="text-2xl font-bold mb-2">{game.title}</h1>
          <p className="mb-1">
            <strong>Description:</strong> {game.description}
          </p>
          <p className="mb-1">
            <strong>Time:</strong> {time1}
          </p>
          <p className="mb-1">
            <strong>Max Players:</strong> {game.max_players}
          </p>
          <p className="mb-4">
            {game.invite != null ? `Discord: ${game.invite}` : "Discord: No ❌"}
          </p>
          {game.invite != null ? (
            <button className="btn btn-sm" onClick={handleCopy}>
              Copy link
            </button>
          ) : (
            ""
          )}

          <h2 className="text-xl font-semibold mt-4 mb-2">General Rules</h2>
          <ul className="list-disc list-inside">
            {game.generalRules.length === 0 ? (
              <li>No general rules</li>
            ) : (
              game.generalRules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))
            )}
          </ul>

          <h2 className="text-xl font-semibold mt-4 mb-2">
            Country-Specific Rules
          </h2>
          <ul className="list-disc list-inside">
            {game.countryRules.length === 0 ? (
              <li>No country-specific rules</li>
            ) : (
              game.countryRules.map((rule, index) => (
                <li key={index}>
                  <strong>{rule.country}:</strong> {rule.description}
                </li>
              ))
            )}
          </ul>
          <div className="mt-4">
            <p className="text-lg font-medium">
              Current Players:{" "}
              <span className="text-yellow-300">{playerCount}</span>
            </p>

            <h3 className="mt-4 text-lg font-medium text-white">
              Players Joined:
            </h3>
            <ul className="list-disc list-inside text-white">
              {players.length === 0 ? (
                <li>No players yet</li>
              ) : (
                players.map((p) => <li key={p.id}>{p.username}</li>)
              )}
            </ul>

            <div className="mt-2 space-x-4">
              {console.log(`userId: ${userId}`)}
              <button
                disabled={hasJoined || !userId}
                className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition ${
                  hasJoined ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleJoin}
              >
                Join Game
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={handleLeave}
              >
                Leave Game
              </button>
            </div>
          </div>
        </div>
        <div>
          {!showChat ? (
            <div className="p-6 max-w-2xl mx-auto bg-gray-500 mt-4 shadow-md rounded-xl flex justify-center">
              <button
                onClick={joinRoom}
                className="btn btn-lg bg-amber-200 text-black"
              >
                Join chat
              </button>
            </div>
          ) : (
            <div className="p-6 max-w-2xl mx-auto bg-gray-500 mt-4 shadow-md rounded-xl">
              <Chat socket={socket} username={username} room={room} />{" "}
              <button
                onClick={hideChat}
                className="btn btn-lg bg-amber-200 text-black"
              >
                Hide chat
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GameDetails;
