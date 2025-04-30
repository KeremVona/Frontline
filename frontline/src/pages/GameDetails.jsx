import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(`/api/games/${id}`, {
          headers: {
            token: localStorage.token,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch game.");

        const data = await response.json();
        setGame(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (loading) return <p className="p-4">Loading game...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-xl">
        <h1 className="text-2xl font-bold mb-2">{game.title}</h1>
        <p className="mb-1">
          <strong>Description:</strong> {game.description}
        </p>
        <p className="mb-1">
          <strong>Time:</strong> {game.game_time}
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
      </div>
    </>
  );
};

export default GameDetails;
