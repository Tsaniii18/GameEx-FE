import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  const finalPrice = game.harga * (1 - game.discount / 100);
  
  return (
    <div className="card">
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={game.gambar} alt={game.title} />
        </figure>
      </div>
      <div className="card-content">
        <h3 className="title is-5">{game.title}</h3>
        <div className="tags">
          {game.tag.split(',').map((tag, index) => (
            <span key={index} className="tag is-primary">{tag.trim()}</span>
          ))}
        </div>
        <div className="content">
          <p className="has-text-weight-semibold">
            Price: ${game.harga} 
            {game.discount > 0 && (
              <span className="has-text-danger ml-2">
                (-{game.discount}%) Now: ${finalPrice.toFixed(2)}
              </span>
            )}
          </p>
          <Link to={`/games/${game.id}`} className="button is-primary is-fullwidth">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};