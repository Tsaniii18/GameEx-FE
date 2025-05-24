import { useState, useEffect } from 'react';
import users from '../services/users';

const PurchaseHistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await users.getPurchaseHistory();
        setHistory(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="title">Purchase History</h1>
      <div className="table-container">
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Game</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Final Price</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.Game?.title}</td>
                <td>${transaction.harga_awal}</td>
                <td>{transaction.discount}%</td>
                <td>${transaction.harga_discount}</td>
                <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};