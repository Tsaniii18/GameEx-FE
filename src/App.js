import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import GameDetailPage from './pages/GameDetailPage';
import LibraryPage from './pages/LibraryPage';
import MyGamesPage from './pages/MyGamesPage';
import UploadGamePage from './pages/UploadGamePage';
import PurchaseHistoryPage from './pages/PurchaseHistoryPage';
import SalesHistoryPage from './pages/SalesHistoryPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/my-games" element={<MyGamesPage />} />
            <Route path="/upload" element={<UploadGamePage />} />
            <Route path="/purchase-history" element={<PurchaseHistoryPage />} />
            <Route path="/sales-history/:id" element={<SalesHistoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;