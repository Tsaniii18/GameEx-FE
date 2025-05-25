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
        if (response.data) {
          setLibrary(response.data);
        } else {
          setError('Received empty library data');
        }
      } catch (err) {
        setError(err.response?.data?.msg || err.message || 'Failed to load library');
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  const toggleStatus = async (gameId, currentStatus) => {
    const newStatus = currentStatus === 'belum' ? 'terinstall' : 'belum';
    try {
      await updateGameStatus(gameId, { status: newStatus });
      setLibrary(prev => prev.map(item => 
        item.game_id === gameId ? { ...item, status: newStatus } : item
      ));
    } catch (err) {
      setError('Failed to update status');
      console.error('Status update error:', err);
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
                    <div className="buttons has-addons">
                      <button
                        className={`button is-small ${item.status === 'belum' ? 'is-primary is-selected' : ''}`}
                        onClick={() => toggleStatus(item.game_id, item.status)}
                        disabled={item.status === 'belum'}
                      >
                        Not Installed
                      </button>
                      <button
                        className={`button is-small ${item.status === 'terinstall' ? 'is-primary is-selected' : ''}`}
                        onClick={() => toggleStatus(item.game_id, item.status)}
                        disabled={item.status === 'terinstall'}
                      >
                        Installed
                      </button>
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