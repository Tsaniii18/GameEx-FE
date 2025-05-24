import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame } from '../../api/games';

const CreateGame = () => {
  const [formData, setFormData] = useState({
    gambar: '',
    harga: '',
    tag: '',
    deskripsi: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const numericPrice = parseFloat(formData.harga);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        throw new Error('Price must be a positive number');
      }

      await createGame({
        ...formData,
        harga: numericPrice
      });
      navigate('/games/my-games');
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to create game');
    }
  };

  return (
    <div className="columns is-centered mt-5">
      <div className="column is-half">
        <div className="box">
          <h1 className="title has-text-centered">Create New Game</h1>
          {error && <div className="notification is-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Image URL</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="gambar"
                  value={formData.gambar}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="field">
              <label className="label">Price</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="field">
              <label className="label">Tags (comma separated)</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="field">
              <div className="control">
                <button className="button is-primary is-fullwidth" type="submit">
                  Create Game
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;