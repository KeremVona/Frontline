import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const GameList = () => {
  const [games, setGames] = useState([]);
  const [isoDate, setIsoDate] = useState(null);
  const [time1, setTime1] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/games", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        // console.log(`data: ${data}`);

        // console.log(`Respone status: ${res}`);
        // console.log(`Fetched games: ${data}`);
        setGames(data);
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };

    fetchGames();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 text-white bg-[#1e1e2f] min-h-screen">
        <h1 className="text-2xl font-bold text-[#ffcc00] mb-6">Hosted Games</h1>
        <div className="space-y-4">
          {games.length === 0 && <p>No games hosted yet.</p>}
          {games.map((game) => (
            <Link
              key={game.id}
              to={`/games/${game.id}`}
              className="block p-4 bg-[#313244] rounded-lg hover:bg-[#2d7d46] transition"
            >
              <h2 className="text-xl font-semibold">{game.title}</h2>
              <p className="text-sm text-[#aaaaaa]">{game.description}</p>
              <p className="mt-1 text-sm">
                Host: <span className="font-medium">{game.host_name}</span>
              </p>
              <p className="text-sm">
                Time:{" "}
                {new Date(game.game_time).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm">Max Players: {game.max_players}</p>
              <p className="text-sm">Discord: {game.invite != null ? "Yes ✅" : "No ❌"}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default GameList;
