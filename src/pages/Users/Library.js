import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLibrary, updateGameStatus, deleteFromLibrary } from '../../api/users';

const Library = () => {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await getLibrary();
        setLibrary(response.data);
      } catch (err) {
        setError('Failed to load library');
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  const handleStatusChange = async (gameId, status) => {
    try {
      await updateGameStatus(gameId, { status });
      setLibrary(prev => prev.map(item => 
        item.game_id === gameId ? { ...item, status } : item
      ));
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (gameId) => {
    if (window.confirm('Are you sure you want to remove this game from your library?')) {
      try {
        await deleteFromLibrary(gameId);
        setLibrary(prev => prev.filter(item => item.game_id !== gameId));
      } catch (err) {
        setError('Failed to remove game');
      }
    }
  };

  if (loading) return <div className="has-text-centered mt-5">Loading...</div>;
  if (error) return <div className="notification is-danger">{error}</div>;

  return (
    <div className="container">
      <h1 className="title">My Library</h1>
      
      {library.length === 0 ? (
        <div className="notification is-info">
          Your library is empty. <Link to="/games">Browse games</Link> to add some!
        </div>
      ) : (
        <div className="columns is-multiline">
          {library.map((item) => (
            <div className="column is-one-third" key={item.id}>
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img src={item.Game.gambar} alt={item.Game.deskripsi} />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="title is-4">{item.Game.deskripsi}</p>
                    </div>
                  </div>
                  
                  <div className="field">
                    <label className="label">Status</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          value={item.status || 'not_played'}
                          onChange={(e) => handleStatusChange(item.game_id, e.target.value)}
                        >
                          <option value="not_played">Not Played</option>
                          <option value="playing">Playing</option>
                          <option value="completed">Completed</option>
                          <option value="dropped">Dropped</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="buttons mt-3">
                    <button 
                      className="button is-danger is-small"
                      onClick={() => handleDelete(item.game_id)}
                    >
                      Remove from Library
                    </button>
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

export default Library;