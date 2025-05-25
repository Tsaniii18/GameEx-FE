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
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [alreadyOwned, setAlreadyOwned] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await getGameDetail(id);
        setGame(response.data);
        
        // Check if user already owns the game
        if (user) {
          // You might want to add an API endpoint to check ownership
          // For now, we'll assume this is checked during purchase
        }
      } catch (err) {
        setError('Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id, user]);

  const handleBuy = async () => {
    setIsPurchasing(true);
    setError('');
    setMessage('');
    
    try {
      const response = await buyGame(id);
      setMessage('Game purchased successfully! Redirecting to your library...');
      
      setTimeout(() => {
        navigate('/library');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Failed to purchase game';
      setError(errorMsg);
      
      if (errorMsg.includes('already owned')) {
        setAlreadyOwned(true);
      }
    } finally {
      setIsPurchasing(false);
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
            <img 
              src={game.gambar} 
              alt={game.nama} 
              className="has-rounded-corners"
              style={{ objectFit: 'cover' }}
            />
          </figure>
        </div>
        <div className="column is-half">
          <div className="content">
            <h1 className="title is-2">{game.nama}</h1>
            <p className="subtitle is-4 has-text-grey-darker">{game.deskripsi}</p>
            <div className="tags">
              {game.tag.split(',').map((tag, index) => (
                <span key={index} className="tag is-info is-light">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="box mt-5">
            <div className="content">
              {game.discount > 0 ? (
                <div className="has-text-centered">
                  <span className="has-text-danger has-text-weight-bold is-size-3">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="has-text-grey-light ml-2 is-size-4" style={{ textDecoration: 'line-through' }}>
                    ${game.harga.toFixed(2)}
                  </span>
                  <span className="tag is-danger is-medium ml-2">{game.discount}% OFF</span>
                </div>
              ) : (
                <div className="has-text-centered is-size-3">${game.harga.toFixed(2)}</div>
              )}
            </div>

            {message && (
              <div className="notification is-success mt-3">
                <button className="delete" onClick={() => setMessage('')}></button>
                {message}
              </div>
            )}

            {error && (
              <div className="notification is-danger mt-3">
                <button className="delete" onClick={() => setError('')}></button>
                {error}
              </div>
            )}

            <div className="buttons is-centered mt-5">
              {isOwner ? (
                <>
                  <button 
                    className="button is-info is-medium"
                    onClick={() => navigate(`/games/${game.id}/edit`)}
                  >
                    <span className="icon">
                      <i className="fas fa-edit"></i>
                    </span>
                    <span>Edit Game</span>
                  </button>
                  <button 
                    className="button is-danger is-medium"
                    onClick={handleDelete}
                  >
                    <span className="icon">
                      <i className="fas fa-trash"></i>
                    </span>
                    <span>Delete Game</span>
                  </button>
                </>
              ) : (
                <button 
                  className={`button is-primary is-large ${isPurchasing ? 'is-loading' : ''}`}
                  onClick={handleBuy}
                  disabled={message || alreadyOwned}
                >
                  {alreadyOwned ? (
                    <>
                      <span className="icon">
                        <i className="fas fa-check"></i>
                      </span>
                      <span>Already Owned</span>
                    </>
                  ) : message ? (
                    <>
                      <span className="icon">
                        <i className="fas fa-check"></i>
                      </span>
                      <span>Purchased!</span>
                    </>
                  ) : (
                    <>
                      <span className="icon">
                        <i className="fas fa-shopping-cart"></i>
                      </span>
                      <span>Buy Now</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;