import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Components/Home';
import About from './Components/About';
import Contact from './Components/Contact';
import Login from './Components/login';
import Register from './Components/register';
import Dashboard from './Components/dashboard';
import EditProfile from './Components/EditProfile';
import ChangePassword from './Components/ChangePassword';
import Products from './Components/Products';
import ProductForm from './Components/ProductForm';
import Cart from './Components/Cart';
import Order from './Components/Order';
import AdminDash from './Components/AdminDash';
import AdminLogin from './Components/AdminLogin';
import ProtectedRoute from './Components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#0a0f1c',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/add-product" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Order /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDash /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}