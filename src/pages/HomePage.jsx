import { useEffect, useState } from 'react';
import GameCard from '../components/GameCard';
import games from '../services/games';

const HomePage = () => {
  const [gameList, setGameList] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await games.getAll();
        setGameList(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGames();
  }, []);

  return (
    <div className="container mt-4">
      <div className="columns is-multiline">
        {gameList.map(game => (
          <div className="column is-4" key={game.id}>
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
};