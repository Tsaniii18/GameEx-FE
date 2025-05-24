import { useState, useEffect } from 'react';
import { getPurchaseHistory } from '../../api/users';

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getPurchaseHistory();
        setHistory(response.data);
      } catch (err) {
        setError('Failed to load purchase history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div className="has-text-centered mt-5">Loading...</div>;
  if (error) return <div className="notification is-danger">{error}</div>;

  return (
    <div className="container">
      <h1 className="title">Purchase History</h1>
      
      {history.length === 0 ? (
        <div className="notification is-info">
          You haven't made any purchases yet.
        </div>
      ) : (
        <div className="table-container">
          <table className="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Game</th>
                <th>Original Price</th>
                <th>Discount</th>
                <th>Final Price</th>
                <th>Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.Game.deskripsi}</td>
                  <td>${transaction.harga_awal.toFixed(2)}</td>
                  <td>{transaction.discount}%</td>
                  <td>${transaction.harga_discount.toFixed(2)}</td>
                  <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;