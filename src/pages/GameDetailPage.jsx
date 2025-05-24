import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import games from '../services/games';

const GameDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await games.getDetail(id);
                setGame(response.data);
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to load game details');
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [id]);

    const Loader = () => (
        <div className="container has-text-centered mt-6">
            <progress className="progress is-medium is-primary" max="100"></progress>
            <p className="subtitle is-5 mt-3">Loading game details...</p>
        </div>
    );

    const Notification = ({ type = 'info', message }) => {
        if (!message) return null;

        return (
            <div className={`container notification is-${type} mt-4`}>
                <button
                    className="delete"
                    onClick={() => setShowNotification(false)}
                ></button>
                {message}
            </div>
        );
    };

    const handleBuy = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await games.buyGame(id);
            setSuccessMsg('Game purchased successfully! Added to your library.');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Purchase failed';
            setError(errorMsg);

            if (errorMsg.includes('own game')) {
                setTimeout(() => setError(''), 5000);
            }
        }
    };

    if (loading) return <Loader />;

    if (!game) return (
        <div className="container mt-6">
            <Notification type="danger" message="Game not found" />
        </div>
    );

    const finalPrice = game.harga * (1 - game.discount / 100);

    return (
        <div className="container mt-4">
            {error && <Notification type="danger" message={error} />}
            {successMsg && <Notification type="success" message={successMsg} />}

            <div className="box">
                <div className="columns">
                    <div className="column is-half">
                        <figure className="image is-16by9">
                            <img
                                src={game.gambar}
                                alt={game.title}
                                className="has-ratio"
                                style={{ borderRadius: '8px' }}
                            />
                        </figure>
                    </div>

                    <div className="column is-half">
                        <h1 className="title is-2">{game.title}</h1>
                        <div className="tags mb-4">
                            {game.tag.split(',').map((tag, index) => (
                                <span key={index} className="tag is-primary is-medium">
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>

                        <div className="content is-medium">
                            <p className="has-text-justified">{game.deskripsi}</p>

                            <div className="price-section mt-5">
                                {game.discount > 0 ? (
                                    <>
                                        <span className="has-text-grey-light is-size-4"
                                            style={{ textDecoration: 'line-through' }}>
                                            ${game.harga.toFixed(2)}
                                        </span>
                                        <span className="has-text-danger is-size-3 ml-3">
                                            ${finalPrice.toFixed(2)}
                                        </span>
                                        <span className="tag is-danger is-medium ml-3">
                                            {game.discount}% OFF!
                                        </span>
                                    </>
                                ) : (
                                    <span className="is-size-3">
                                        ${game.harga.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {user ? (
                                <button
                                    onClick={handleBuy}
                                    className="button is-primary is-large mt-5"
                                    style={{ width: '100%' }}
                                >
                                    Buy Now
                                </button>
                            ) : (
                                <div className="notification is-warning mt-5">
                                    Please login to purchase this game
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="box mt-5">
                <h2 className="title is-4">About this game</h2>
                <div className="content">
                    {/* Tambahkan konten detail tambahan sesuai kebutuhan */}
                    <p>Uploaded by: {game.uploader?.username || 'Unknown'}</p>
                    <p>Release date: {new Date(game.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default GameDetailPage;