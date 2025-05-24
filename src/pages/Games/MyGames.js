import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyGames } from '../../api/users';
import { applyDiscount } from '../../api/games';
const MyGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [discountInputs, setDiscountInputs] = useState({});

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getMyGames();
        setGames(response.data);
        
        // Initialize discount inputs
        const inputs = {};
        response.data.forEach(game => {
          inputs[game.id] = game.discount || 0;
        });
        setDiscountInputs(inputs);
      } catch (err) {
        setError('Failed to load your games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleDiscountChange = (gameId, value) => {
    setDiscountInputs(prev => ({
      ...prev,
      [gameId]: Math.min(100, Math.max(0, value))
    }));
  };

  const applyGameDiscount = async (gameId) => {
    try {
      await applyDiscount(gameId, { discount: discountInputs[gameId] });
      setGames(prev => prev.map(game => 
        game.id === gameId ? { ...game, discount: discountInputs[gameId] } : game
      ));
    } catch (err) {
      setError('Failed to apply discount');
    }
  };

  if (loading) return <div className="has-text-centered mt-5">Loading...</div>;
  if (error) return <div className="notification is-danger">{error}</div>;

  return (
    <div className="container">
      <h1 className="title">My Games</h1>
      
      {games.length === 0 ? (
        <div className="notification is-info">
          You haven't uploaded any games yet. <Link to="/games/create">Create your first game</Link>!
        </div>
      ) : (
        <div className="columns is-multiline">
          {games.map((game) => (
            <div className="column is-one-third" key={game.id}>
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src={game.gambar} alt={game.deskripsi} />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="title is-4">{game.deskripsi}</p>
                      <p className="subtitle is-6">Tags: {game.tag}</p>
                    </div>
                  </div>
                  
                  <div className="content">
                    <div className="is-size-5">${game.harga.toFixed(2)}</div>
                    {game.discount > 0 && (
                      <span className="tag is-danger">{game.discount}% discount applied</span>
                    )}
                  </div>
                  
                  <div className="field has-addons">
                    <div className="control is-expanded">
                      <input
                        className="input"
                        type="number"
                        min="0"
                        max="100"
                        value={discountInputs[game.id]}
                        onChange={(e) => handleDiscountChange(game.id, parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="control">
                      <button 
                        className="button is-info"
                        onClick={() => applyGameDiscount(game.id)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                  
                  <div className="buttons mt-3">
                    <Link 
                      to={`/games/${game.id}`} 
                      className="button is-primary is-small"
                    >
                      View
                    </Link>
                    <Link 
                      to={`/games/${game.id}/edit`} 
                      className="button is-info is-small"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGames;