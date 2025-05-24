import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GameCard = ({ game }) => {
  const { user } = useAuth();
  const isOwner = user && user.userId === game.uploader_id;
  const discountedPrice = game.harga * (1 - (game.discount || 0) / 100);

  return (
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
          {game.discount > 0 ? (
            <div>
              <span className="has-text-danger has-text-weight-bold">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="has-text-grey-light ml-2" style={{ textDecoration: 'line-through' }}>
                ${game.harga.toFixed(2)}
              </span>
              <span className="tag is-danger ml-2">{game.discount}% OFF</span>
            </div>
          ) : (
            <div>${game.harga.toFixed(2)}</div>
          )}
        </div>

        <div className="buttons">
          <Link to={`/games/${game.id}`} className="button is-primary is-small">
            Details
          </Link>
          {isOwner && (
            <Link to={`/games/my-games`} className="button is-info is-small">
              Manage
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;