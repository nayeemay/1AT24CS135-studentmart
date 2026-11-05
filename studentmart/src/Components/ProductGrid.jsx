import React, { useState, useEffect } from 'react';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  // Helper to safely calculate remaining stock (defaults to 10 if stock is missing or 0)
  const getRemainingStock = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productId = product._id || product.id;
    const cartItem = cart.find(item => (item._id || item.id) === productId);
    const inCartQty = cartItem ? (cartItem.quantity || 1) : 0;
    
    // If stock is missing, null, or 0, fallback to 10 so items aren't stuck as out of stock
    const rawStock = Number(product.stock);
    const initialStock = (!isNaN(rawStock) && rawStock > 0) ? rawStock : 10;
    
    return Math.max(0, initialStock - inCartQty);
  };

  useEffect(() => {
    fetch('http://localhost:5002/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });

    const handleCartUpdate = () => {
      setProducts(prev => [...prev]);
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const addToCart = (product) => {
    const remaining = getRemainingStock(product);
    if (remaining <= 0) {
      setNotification(`❌ Sorry, "${product.name || product.title}" is out of stock!`);
      setTimeout(() => setNotification(''), 3500);
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const productId = product._id || product.id;
    const existingIndex = existingCart.findIndex(item => (item._id || item.id) === productId);

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = existingCart.map((item, index) => 
        index === existingIndex ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
      setNotification(`⚠️ "${product.name || product.title}" is already in your cart! Increased quantity.`);
    } else {
      updatedCart = [...existingCart, { ...product, quantity: 1 }];
      setNotification(`🛒 Added "${product.name || product.title}" to cart!`);
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));

    setTimeout(() => setNotification(''), 3500);
  };

  if (loading) return <p style={{ fontSize: '14px', color: '#6b7280' }}>Loading products...</p>;

  if (products.length === 0) {
    return <p style={{ fontSize: '14px', color: '#6b7280' }}>No products available yet. Add one from the sidebar!</p>;
  }

  return (
    <div>
      {notification && (
        <div style={{ marginBottom: '16px', padding: '10px 16px', backgroundColor: notification.includes('already') || notification.includes('Sorry') ? '#fef3c7' : '#d1fae5', color: notification.includes('already') || notification.includes('Sorry') ? '#92400e' : '#065f46', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: '1px solid #fcd34d' }}>
          {notification}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {products.map((product) => {
          const currentStock = getRemainingStock(product);
          const isOut = currentStock === 0;

          return (
            <div key={product._id || product.id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {product.image && (
                  <img 
                    src={product.image} 
                    alt={product.name || product.title} 
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} 
                    onError={(e) => { e.target.style.display = 'none'; }} 
                  />
                )}
                <h5 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>{product.name || product.title}</h5>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#059669', margin: '0 0 8px 0' }}>₹{product.price}</p>
                <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 12px 0' }}>{product.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ display: 'inline-block', backgroundColor: '#f3f4f6', color: '#374151', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
                    {product.category || 'General'}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: isOut ? '#dc2626' : '#4b5563' }}>
                    Stock: <span style={{ color: isOut ? '#dc2626' : '#111827' }}>{currentStock} available</span>
                  </span>
                </div>
              </div>
              <button 
                onClick={() => addToCart(product)}
                disabled={isOut}
                style={{ backgroundColor: isOut ? '#9ca3af' : '#111827', color: '#ffffff', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: isOut ? 'not-allowed' : 'pointer', width: '100%' }}
              >
                {isOut ? 'Out of Stock ❌' : 'Add to Cart 🛒'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}