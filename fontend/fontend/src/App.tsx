import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import User from './pages/User';
import Staff from './pages/Staff';
import { initializeSampleData } from './utils/initData';

function App() {
  useEffect(() => {
    try {
      console.log('Initializing sample data...');
      initializeSampleData();
      console.log('Sample data initialized successfully!');
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }, []);

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user" element={<User />} />
          <Route path="/staff" element={<Staff />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
