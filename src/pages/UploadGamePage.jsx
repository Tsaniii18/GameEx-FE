import { useState } from 'react';
import games from '../services/games';

const UploadGamePage = () => {
  const [form, setForm] = useState({
    title: '',
    harga: 0,
    tag: '',
    deskripsi: ''
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await games.uploadGame(form);
      alert('Game uploaded successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Upload failed');
    }
  };

  return (
    <div className="container mt-4">
      <div className="box">
        <h1 className="title">Upload New Game</h1>
        <form onSubmit={handleUpload}>
          {/* Form fields untuk detail game */}
          <button type="submit" className="button is-primary">
            Upload Game
          </button>
        </form>
      </div>
    </div>
  );
};