import { useState, useEffect } from 'react';
import users from '../services/users';

const LibraryPage = () => {
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      const response = await users.getLibrary();
      setLibrary(response.data);
    };
    fetchLibrary();
  }, []);

  const updateStatus = async (gameId, status) => {
    try {
      await users.updateGameStatus(gameId, { status });
      setLibrary(library.map(item => 
        item.game_id === gameId ? {...item, status} : item
      ));
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="title">My Library</h1>
      <div className="columns is-multiline">
        {library.map(item => (
          <div className="column is-4" key={item.game_id}>
            <div className="box">
              <h2 className="subtitle">{item.Game.title}</h2>
              <p>Status: {item.status || 'Not installed'}</p>
              <div className="buttons mt-3">
                <button
                  onClick={() => updateStatus(item.game_id, 'Installed')}
                  className="button is-small is-success"
                >
                  Install
                </button>
                <button
                  onClick={() => updateStatus(item.game_id, 'Uninstalled')}
                  className="button is-small is-warning"
                >
                  Uninstall
                </button>
                <button
                  onClick={() => users.deleteFromLibrary(item.game_id)}
                  className="button is-small is-danger"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};