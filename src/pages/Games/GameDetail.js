import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getGameDetail, deleteGame } from '../../api/games';
import { buyGame } from '../../api/users';

const GameDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await getGameDetail(id);
        setGame(response.data);
      } catch (err) {
        setError('Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const handleBuy = async () => {
    try {
      const response = await buyGame(id);
      setMessage('Game purchased successfully!');
      setTimeout(() => {
        navigate('/library');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to purchase game');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      try {
        await deleteGame(id);
        navigate('/games/my-games');
      } catch (err) {
        setError('Failed to delete game');
      }
    }
  };

  if (loading) return <div className="has-text-centered mt-5">Loading...</div>;
  if (error) return <div className="notification is-danger">{error}</div>;
  if (!game) return <div className="notification is-warning">Game not found</div>;

  const isOwner = user && user.userId === game.uploader_id;
  const discountedPrice = game.harga * (1 - (game.discount || 0) / 100);

  return (
    <div className="container">
      <div className="columns">
        <div className="column is-half">
          <figure className="image is-16by9">
            <img src={game.gambar} alt={game.deskripsi} />
          </figure>
        </div>
        <div className="column is-half">
          <h1 className="title">{game.deskripsi}</h1>
          <h2 className="subtitle">Tags: {game.tag}</h2>
          
          <div className="content mt-5">
            {game.discount > 0 ? (
              <div>
                <span className="has-text-danger has-text-weight-bold is-size-3">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="has-text-grey-light ml-2 is-size-4" style={{ textDecoration: 'line-through' }}>
                  ${game.harga.toFixed(2)}
                </span>
                <span className="tag is-danger is-medium ml-2">{game.discount}% OFF</span>
              </div>
            ) : (
              <div className="is-size-3">${game.harga.toFixed(2)}</div>
            )}
          </div>

          {message && <div className="notification is-success">{message}</div>}

          <div className="buttons mt-5">
            {isOwner ? (
              <>
                <button 
                  className="button is-info"
                  onClick={() => navigate(`/games/${game.id}/edit`)}
                >
                  Edit Game
                </button>
                <button 
                  className="button is-danger"
                  onClick={handleDelete}
                >
                  Delete Game
                </button>
              </>
            ) : (
              <button 
                className="button is-primary is-large"
                onClick={handleBuy}
                disabled={message}
              >
                {message || 'Buy Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;