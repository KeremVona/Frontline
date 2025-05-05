import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function HostGame() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gameTime, setGameTime] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(8);

  const [generalRuleInput, setGeneralRuleInput] = useState("");
  const [generalRules, setGeneralRules] = useState([]);

  const [country, setCountry] = useState("");
  const [countryRuleInput, setCountryRuleInput] = useState("");
  const [countryRules, setCountryRules] = useState([]);

  const navigate = useNavigate();

  const addGeneralRule = () => {
    if (generalRuleInput.trim()) {
      setGeneralRules([...generalRules, generalRuleInput.trim()]);
      setGeneralRuleInput("");
    }
  };

  const addCountryRule = () => {
    if (country.trim() && countryRuleInput.trim()) {
      setCountryRules([
        ...countryRules,
        { country, description: countryRuleInput.trim() },
      ]);
      setCountry("");
      setCountryRuleInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gameData = {
      title,
      description,
      gameTime,
      maxPlayers,
      generalRules,
      countryRules,
    };

    const token = localStorage.getItem("token");
    // http://localhost:5000/dashboard
    const response = await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(gameData),
    });

    if (response.ok) {
      const newGame = await response.json();
      navigate(`/games/${newGame.id}`);
    } else {
      alert("Failed to make game.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Host a Game</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            className="w-full p-2 border rounded"
            value={gameTime}
            onChange={(e) => setGameTime(e.target.value)}
            required
          />
          <input
            type="number"
            min="2"
            max="20"
            className="w-full p-2 border rounded"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
            required
          />

          {/* General Rules */}
          <div>
            <label className="font-semibold">General Rules</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={generalRuleInput}
                onChange={(e) => setGeneralRuleInput(e.target.value)}
                placeholder="e.g. No paratroopers"
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={addGeneralRule}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
            <ul className="list-disc ml-6 mt-2">
              {generalRules.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          </div>

          {/* Country-Specific Rules */}
          <div>
            <label className="font-semibold">Country-Specific Rules</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Germany"
                className="w-1/3 p-2 border rounded"
              />
              <input
                type="text"
                value={countryRuleInput}
                onChange={(e) => setCountryRuleInput(e.target.value)}
                placeholder="e.g. Can't research Weapons II"
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={addCountryRule}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
            <ul className="list-disc ml-6 mt-2">
              {countryRules.map((rule, i) => (
                <li key={i}>
                  <strong>{rule.country}</strong>: {rule.description}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded"
          >
            Host Game
          </button>
        </form>
      </div>
    </>
  );
}
