import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isoDate, setIsoDate] = useState(null);
  const [time1, setTime1] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const fetchGameDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`/api/games/${id}`, {
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

        // console.log(`data: ${data.game_time}`);
        setGame(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    // Join the game room
    socket.emit("joinGame", { gameId: id });

    // Listen for updates
    socket.on("playerCountUpdate", ({ gameId: updatedId, count }) => {
      if (updatedId === id) {
        setPlayerCount(count);
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.emit("leaveGame", { gameId: id });
      socket.off("playerCountUpdate");
    };
  }, [id]);

  if (loading) return <p className="p-4">Loading game...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto bg-gray-500 mt-4 shadow-md rounded-xl">
        <h1 className="text-2xl font-bold mb-2">{game.title}</h1>
        <p className="mb-1">
          <strong>Description:</strong> {game.description}
        </p>
        <p className="mb-1">
          <strong>Time:</strong> {time1}
        </p>
        <p className="mb-4">
          <strong>Max Players:</strong> {game.max_players}
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">General Rules</h2>
        <ul className="list-disc list-inside">
          {game.generalRules.length === 0 ? (
            <li>No general rules</li>
          ) : (
            game.generalRules.map((rule, index) => <li key={index}>{rule}</li>)
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

          <div className="mt-2 space-x-4">
            {!hasJoined ? (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => {
                  socket.emit("joinGame", { gameId: id });
                  setHasJoined(true);
                }}
              >
                Join Game
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => {
                  socket.emit("leaveGame", { gameId: id });
                  setHasJoined(false);
                }}
              >
                Leave Game
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameDetails;
