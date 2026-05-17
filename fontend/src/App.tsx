import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import User from './pages/User';
import Staff from './pages/Staff';
import Pos from './pages/Pos';
import ServiceDetail from './pages/ServiceDetail';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/pos" element={<Pos />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
