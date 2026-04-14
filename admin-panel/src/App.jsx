import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReservationsPage from './pages/ReservationsPage';

// TODO: If the app ever needs to survive a page refresh, isLoggedIn could be
// persisted to sessionStorage. Currently credentials are memory-only by design.
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? <DashboardPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/reservations/:courtId"
          element={
            isLoggedIn ? <ReservationsPage /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
