import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import games from '../services/games';

const SalesHistoryPage = () => {
  const { id } = useParams();
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await games.getSalesHistory(id);
        setSales(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSales();
  }, [id]);

  return (
    <div className="container mt-4">
      <h1 className="title">Sales History</h1>
      <div className="table-container">
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Buyer ID</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Final Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.id_pembeli}</td>
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