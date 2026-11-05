import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductForm from './ProductForm';
import ProductGrid from './ProductGrid';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(storedUser);
    }

    const handleCartUpdate = () => {
      const saved = localStorage.getItem('cart');
      setCart(saved ? JSON.parse(saved) : []);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const updateQuantity = (index, delta) => {
    const newCart = [...cart];
    const newQty = (newCart[index].quantity || 1) + delta;
    if (newQty <= 0) {
      newCart.splice(index, 1);
    } else {
      newCart[index].quantity = newQty;
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
            <span style={{ backgroundColor: '#111827', color: '#ffffff', fontWeight: 'bold', padding: '8px 12px', borderRadius: '10px', fontSize: '18px' }}>S</span>
            <div>
              <h2 style={{ fontWeight: 'bold', color: '#111827', fontSize: '16px', margin: 0 }}>StudentMart</h2>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Your student space</p>
            </div>
          </div>
          
          <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Student Workspace</p>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={() => setActiveTab('overview')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', backgroundColor: activeTab === 'overview' ? '#f3f4f6' : 'transparent', color: '#111827', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
              <span>📊</span>
              <span>Dashboard</span>
            </button>
            <button onClick={() => setActiveTab('profile')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', backgroundColor: activeTab === 'profile' ? '#f3f4f6' : 'transparent', color: '#4b5563', fontWeight: '500', fontSize: '14px', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
              <span>👤</span>
              <span>My Profile</span>
            </button>
            <button onClick={() => setActiveTab('edit')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', backgroundColor: activeTab === 'edit' ? '#f3f4f6' : 'transparent', color: '#4b5563', fontWeight: '500', fontSize: '14px', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
              <span>✏️</span>
              <span>Edit Profile</span>
            </button>
            <button onClick={() => setActiveTab('products')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', backgroundColor: activeTab === 'products' ? '#f3f4f6' : 'transparent', color: '#4b5563', fontWeight: '500', fontSize: '14px', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
              <span>📦</span>
              <span>Products</span>
            </button>
            <button onClick={() => setActiveTab('add-product')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', backgroundColor: activeTab === 'add-product' ? '#f3f4f6' : 'transparent', color: '#4b5563', fontWeight: '500', fontSize: '14px', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
              <span>➕</span>
              <span>Add Product</span>
            </button>
            <button onClick={() => setActiveTab('cart')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', backgroundColor: activeTab === 'cart' ? '#f3f4f6' : 'transparent', color: '#4b5563', fontWeight: '500', fontSize: '14px', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
              <span>🛒</span>
              <span>Shopping Cart {cart.length > 0 && `(${cart.reduce((a, c) => a + (c.quantity || 1), 0)})`}</span>
            </button>
          </nav>
        </div>

        <div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4b5563', fontWeight: '500', fontSize: '14px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            {activeTab === 'overview' && 'Dashboard'}
            {activeTab === 'profile' && 'My Profile'}
            {activeTab === 'edit' && 'Edit Profile'}
            {activeTab === 'products' && 'Available Products'}
            {activeTab === 'add-product' && 'Add New Product'}
            {activeTab === 'cart' && 'Shopping Cart'}
          </h1>
          <div style={{ backgroundColor: '#111827', color: '#ffffff', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
            {user?.usn || 'USN'}
          </div>
        </div>

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'overview' && (
          <>
            <div style={{ backgroundColor: '#4f46e5', borderRadius: '24px', padding: '32px', color: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
              <p style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c7d2fe', marginBottom: '8px' }}>Your space. Your journey.</p>
              <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', margin: 0 }}>Hello, {user?.usn || user?.fullName || 'Student'}! 👋</h2>
              <p style={{ fontSize: '14px', color: '#e0e7ff', maxWidth: '500px', marginBottom: '24px' }}>Everything you need to manage your student profile and explore StudentMart, all in one place.</p>
              <button onClick={() => setActiveTab('profile')} style={{ backgroundColor: '#ffffff', color: '#4f46e5', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                View my profile →
              </button>
            </div>

            <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Your account overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '12px', fontSize: '20px' }}>🎓</div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: 0 }}>University Seat Number</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{user?.usn || 'Not Provided'}</p>
                </div>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '12px', fontSize: '20px' }}>✉️</div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: 0 }}>Email address</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{user?.email || 'student@example.com'}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: My Profile */}
        {activeTab === 'profile' && (
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>Student Profile Details</h3>
            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}><strong>Full Name:</strong> {user?.fullName || user?.name || 'N/A'}</p>
            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}><strong>USN:</strong> {user?.usn || 'N/A'}</p>
            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '20px' }}><strong>Email:</strong> {user?.email || 'N/A'}</p>
            <button onClick={() => setActiveTab('edit')} style={{ backgroundColor: '#111827', color: '#ffffff', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
              Edit Details
            </button>
          </div>
        )}

        {/* Tab 3: Edit Profile */}
        {activeTab === 'edit' && (
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>Update Profile</h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>You can navigate to your dedicated edit page or update your info here.</p>
            <Link to="/edit" style={{ display: 'inline-block', marginTop: '16px', backgroundColor: '#4f46e5', color: '#ffffff', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
              Go to Edit Page →
            </Link>
          </div>
        )}

        {/* Tab 4: Products Grid */}
        {activeTab === 'products' && (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            <ProductGrid />
          </div>
        )}

        {/* Tab 5: Add Product Form */}
        {activeTab === 'add-product' && (
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb', maxWidth: '600px' }}>
            <ProductForm />
          </div>
        )}

        {/* Tab 6: Shopping Cart */}
        {activeTab === 'cart' && (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', maxWidth: '750px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>🛒 Your Shopping Cart</h3>
            {cart.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Your cart is empty. Add items from the Products tab!</p>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {cart.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <div>
                        <span style={{ fontWeight: '600', fontSize: '15px', color: '#111827' }}>{item.name || item.title}</span>
                        <div style={{ fontSize: '13px', color: '#059669', fontWeight: '700', marginTop: '4px' }}>
                          ₹{item.price} × {item.quantity || 1} = ₹{item.price * (item.quantity || 1)}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#ffffff' }}>
                          <button onClick={() => updateQuantity(index, -1)} style={{ padding: '4px 10px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>-</button>
                          <span style={{ padding: '0 8px', fontSize: '14px', fontWeight: '600' }}>{item.quantity || 1}</span>
                          <button onClick={() => updateQuantity(index, 1)} style={{ padding: '4px 10px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(index)} style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #e5e7eb', paddingTop: '16px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Total Price:</span>
                  <span style={{ fontSize: '22px', fontWeight: '800', color: '#059669' }}>₹{totalPrice}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}