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
  const [paymentMethod, setPaymentMethod] = useState('');

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
  }, [id, user]);

  const handleBuy = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    setIsPurchasing(true);
    setError('');
    setMessage('');

    try {
      await buyGame({ gameId: id, paymentMethod });
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
  if (error && !message) return <div className="notification is-danger">{error}</div>;
  if (!game) return <div className="notification is-warning">Game not found</div>;

  const isOwner = user && game.User && user.userId === game.User.id;
  const discountedPrice = game.harga * (1 - (game.discount || 0) / 100);

  return (
    <div className="container mt-5">
      <div className="columns is-multiline">
        <div className="column is-full-tablet is-half-desktop">
          <figure className="image is-16by9">
            <img 
              src={game.gambar} 
              alt={game.nama} 
              style={{ objectFit: 'cover', borderRadius: '12px' }}
            />
          </figure>
        </div>
        <div className="column is-full-tablet is-half-desktop">
          <div className="content">
            <h1 className="title is-2">{game.nama}</h1>
            <p className="subtitle is-5 has-text-grey-darker">{game.deskripsi}</p>
            <div className="tags mb-4">
              {game.tag.split(',').map((tag, index) => (
                <span key={index} className="tag is-info is-light">{tag.trim()}</span>
              ))}
            </div>
          </div>

          <div className="box">
            <div className="content has-text-centered">
              {game.discount > 0 ? (
                <>
                  <span className="has-text-danger has-text-weight-bold is-size-3">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="has-text-grey-light ml-3 is-size-5" style={{ textDecoration: 'line-through' }}>
                    ${game.harga.toFixed(2)}
                  </span>
                  <span className="tag is-danger is-medium ml-3">{game.discount}% OFF</span>
                </>
              ) : (
                <span className="is-size-3 has-text-weight-semibold">${game.harga.toFixed(2)}</span>
              )}
            </div>

            {message && (
              <div className="notification is-success mt-4">
                <button className="delete" onClick={() => setMessage('')}></button>
                {message}
              </div>
            )}

            {error && (
              <div className="notification is-danger mt-4">
                <button className="delete" onClick={() => setError('')}></button>
                {error}
              </div>
            )}

            {/* Payment Method Selection */}
            {!isOwner && !alreadyOwned && !message && (
              <div className="field mt-4">
                <label className="label">Choose Payment Method</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="">-- Select Payment Method --</option>
                      <option value="dana">DANA</option>
                      <option value="gopay">GoPay</option>
                      <option value="ovo">OVO</option>
                      <option value="mandiri">Bank Mandiri</option>
                      <option value="bca">Bank BCA</option>
                      <option value="bri">Bank BRI</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="buttons is-centered mt-5">
              {isOwner ? (
                <>
                  <button 
                    className="button is-info is-medium"
                    onClick={() => navigate(`/games/${game.id}/edit`)}
                  >
                    <span className="icon"><i className="fas fa-edit"></i></span>
                    <span>Edit Game</span>
                  </button>
                  <button 
                    className="button is-danger is-medium"
                    onClick={handleDelete}
                  >
                    <span className="icon"><i className="fas fa-trash"></i></span>
                    <span>Delete Game</span>
                  </button>
                </>
              ) : (
                <button 
                  className={`button is-primary is-large ${isPurchasing ? 'is-loading' : ''}`}
                  onClick={handleBuy}
                  disabled={!paymentMethod || message || alreadyOwned}
                >
                  {alreadyOwned ? (
                    <>
                      <span className="icon"><i className="fas fa-check"></i></span>
                      <span>Already Owned</span>
                    </>
                  ) : message ? (
                    <>
                      <span className="icon"><i className="fas fa-check"></i></span>
                      <span>Purchased!</span>
                    </>
                  ) : (
                    <>
                      <span className="icon"><i className="fas fa-shopping-cart"></i></span>
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
