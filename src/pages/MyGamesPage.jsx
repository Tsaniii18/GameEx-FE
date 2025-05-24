import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import games from '../services/games';

const MyGamesPage = () => {
  const [myGames, setMyGames] = useState([]);
  const [discountForm, setDiscountForm] = useState({});

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await games.getMyGames();
        setMyGames(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGames();
  }, []);

  const handleApplyDiscount = async (gameId) => {
    try {
      await games.applyDiscount(gameId, discountForm[gameId]);
      alert('Discount applied successfully!');
      setMyGames(myGames.map(game => 
        game.id === gameId ? {...game, discount: discountForm[gameId]} : game
      ));
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to apply discount');
    }
  };

  const handleDelete = async (gameId) => {
    if (window.confirm('Delete this game?')) {
      try {
        await games.deleteGame(gameId);
        setMyGames(myGames.filter(game => game.id !== gameId));
      } catch (err) {
        alert('Deletion failed');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="title">My Uploaded Games</h1>
      <Link to="/upload" className="button is-primary mb-4">Upload New Game</Link>
      
      <div className="columns is-multiline">
        {myGames.map(game => (
          <div className="column is-4" key={game.id}>
            <div className="box">
              <h2 className="subtitle">{game.title}</h2>
              <div className="field has-addons">
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    placeholder="Discount %"
                    value={discountForm[game.id] || ''}
                    onChange={(e) => setDiscountForm({
                      ...discountForm,
                      [game.id]: e.target.value
                    })}
                  />
                </div>
                <div className="control">
                  <button
                    onClick={() => handleApplyDiscount(game.id)}
                    className="button is-info"
                  >
                    Apply
                  </button>
                </div>
              </div>
              <div className="buttons">
                <Link 
                  to={`/sales-history/${game.id}`}
                  className="button is-small is-info"
                >
                  Sales History
                </Link>
                <Link
                  to={`/edit-game/${game.id}`}
                  className="button is-small is-warning"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(game.id)}
                  className="button is-small is-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};