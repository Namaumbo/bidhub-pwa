import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { useAuthStore } from './store/authStore';
import Layout from './features/layout/Layout';
import AuthFlow from './features/auth/AuthFlow';
import Messages from './features/messages/Messages';
import Profile from './features/profile/Profile';

// Buyer screens
import BuyerHome from './features/buyer/BuyerHome';
import PostRequest from './features/buyer/PostRequest';
import BuyerBids from './features/buyer/BuyerBids';

// Seller screens
import SellerBrowse from './features/seller/SellerBrowse';
import SellerBids from './features/seller/SellerBids';
import RequestDetail from './features/seller/RequestDetail';

function App() {
  const { user, role, setUser, setLoading, loading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading]);

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', flexDirection: 'column', gap: '12px',
      }}>
        <div style={{
          width: 48, height: 48, background: 'var(--primary-gradient)',
          borderRadius: 12, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.2rem',
        }}>BH</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="*" element={<AuthFlow />} />
        ) : role === 'buyer' ? (
          <Route element={<Layout role="buyer" />}>
            <Route path="/" element={<BuyerHome />} />
            <Route path="/post-request" element={<PostRequest />} />
            <Route path="/bids/:requestId" element={<BuyerBids />} />
            <Route path="/bids-overview" element={<BuyerHome />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : role === 'seller' ? (
          <Route element={<Layout role="seller" />}>
            <Route path="/" element={<SellerBrowse />} />
            <Route path="/request/:requestId" element={<RequestDetail />} />
            <Route path="/my-bids" element={<SellerBids />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<AuthFlow />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
