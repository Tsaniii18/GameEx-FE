import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameDetail, updateGame } from '../../api/games';

const EditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [formData, setFormData] = useState({
  nama: '',
  gambar: '',
  harga: '',
  tag: '',
  deskripsi: ''
});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await getGameDetail(id);
        setFormData({
          nama: response.data.nama,
          gambar: response.data.gambar,
          harga: response.data.harga,
          tag: response.data.tag,
          deskripsi: response.data.deskripsi
        });
      } catch (err) {
        setError('Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const numericPrice = parseFloat(formData.harga);
      if (isNaN(numericPrice)) {
        throw new Error('Price must be a number');
      }

      await updateGame(id, {
        ...formData,
        harga: numericPrice
      });
      navigate(`/games/${id}`);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to update game');
    }
  };

  if (loading) return <div className="has-text-centered mt-5">Loading...</div>;
  if (error) return <div className="notification is-danger">{error}</div>;

  return (
    <div className="columns is-centered mt-5">
      <div className="column is-half">
        <div className="box">
          <h1 className="title has-text-centered">Edit Game</h1>
          
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
               <label className="label">Game Name</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="nama"
                    value={formData.nama}
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
                  Update Game
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGame;