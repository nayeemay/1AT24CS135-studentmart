import React, { useState, useEffect } from 'react';

function ProductGridCard3D({ product, onAddToCart }) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, hovered: false });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: Number(((0.5 - relY) * 11).toFixed(2)),
      rotateY: Number(((relX - 0.5) * 11).toFixed(2)),
      glowX: Math.round(relX * 100),
      glowY: Math.round(relY * 100),
      hovered: true
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, hovered: false });
  };

  const displayName = product.name || product.title;

  return (
    <div style={{ perspective: '1150px' }}>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          background: 'linear-gradient(155deg, rgba(30, 41, 59, 0.96) 0%, rgba(15, 23, 42, 0.98) 100%)',
          borderRadius: '18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.18)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.10)',
          borderRight: '1px solid rgba(15, 23, 42, 0.9)',
          borderBottom: '4px solid #090d16',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: tilt.hovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-6px) scale(1.015)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
          transition: tilt.hovered
            ? 'transform 0.08s ease-out, box-shadow 0.2s ease'
            : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease',
          boxShadow: tilt.hovered
            ? '0 28px 45px -12px rgba(0, 0, 0, 0.72), 0 0 24px rgba(59, 130, 246, 0.22)'
            : '0 14px 26px -10px rgba(0, 0, 0, 0.58)'
        }}
      >
        {/* Dynamic 3D Specular Light Reflection */}
        <div
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            background: tilt.hovered
              ? `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255, 255, 255, 0.12), transparent 60%)`
              : 'none',
            zIndex: 2
          }}
        />

        {/* Top Image Stage with Z-depth */}
        <div style={{ transform: 'translateZ(18px)' }}>
          <div style={{ position: 'relative', overflow: 'hidden', background: '#090f1d' }}>
            {product.image ? (
              <img
                src={product.image}
                alt={displayName}
                style={{
                  width: '100%',
                  height: '175px',
                  objectFit: 'cover',
                  display: 'block',
                  transform: tilt.hovered ? 'scale(1.06)' : 'scale(1)',
                  transition: 'transform 0.35s ease'
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '175px',
                  background: 'radial-gradient(circle at top, #1e293b 0%, #090f1d 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  fontSize: '13px',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '26px', opacity: 0.7 }}>📦</span>
                <span>No Image</span>
              </div>
            )}

            {/* Floating 3D Category Pill */}
            <span
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.3px',
                color: '#93c5fd',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(96, 165, 250, 0.35)',
                boxShadow: '0 6px 14px rgba(0, 0, 0, 0.45)'
              }}
            >
              {product.category || 'General'}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div
          style={{
            padding: '16px 18px 18px 18px',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            transform: 'translateZ(20px)',
            position: 'relative',
            zIndex: 3
          }}
        >
          <h3
            style={{
              fontSize: '17px',
              fontWeight: '700',
              color: '#f8fafc',
              margin: '0 0 8px 0',
              textShadow: '0 2px 6px rgba(0,0,0,0.4)'
            }}
          >
            {displayName}
          </h3>

          <p
            style={{
              fontSize: '13px',
              color: '#94a3b8',
              margin: '0 0 16px 0',
              flex: 1,
              lineHeight: 1.45
            }}
          >
            {product.description}
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'auto',
              paddingTop: '12px',
              borderTop: '1px solid rgba(148, 163, 184, 0.16)'
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#34d399',
                  textShadow: '0 2px 10px rgba(52, 211, 153, 0.25)'
                }}
              >
                ₹{product.price}
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: '600' }}>
                Stock: {product.stock}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onAddToCart(product)}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(3px)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
              style={{
                background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                color: '#fff',
                border: 'none',
                borderTop: '1px solid rgba(255,255,255,0.35)',
                borderBottom: '3px solid #1d4ed8',
                padding: '9px 14px',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '13px',
                boxShadow: '0 10px 18px -6px rgba(37, 99, 235, 0.65)',
                transition: 'transform 0.1s ease'
              }}
            >
              Add to Cart 🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  const loadProducts = () => {
    const defaultProducts = [
      {
        _id: 'prod-1',
        name: 'Computer Networks Textbook',
        price: 450,
        description: 'Standard reference book for CSE students.',
        category: 'Books',
        stock: 10,
        image: 'https://books.google.com/books/content?id=IRUvAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
      },
      {
        _id: 'prod-2',
        name: 'Scientific Calculator',
        price: 850,
        description: 'Casio fx-991ES Plus for engineering exams.',
        category: 'Electronics',
        stock: 5,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
      }
    ];

    const custom = JSON.parse(localStorage.getItem('customProducts') || '[]');
    const customIds = new Set(custom.map((p) => p._id || p.id));
    const filteredDefaults = defaultProducts.filter((p) => !customIds.has(p._id || p.id));

    setProducts([...custom, ...filteredDefaults]);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const pid = product._id || product.id;
    const existingIndex = cart.findIndex((item) => (item._id || item.id) === pid);

    if (existingIndex > -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setMessage(`Added "${product.name || product.title}" to cart! 🛒`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 15% 10%, #1e293b 0%, #0b1120 55%, #060913 100%)',
        color: '#fff',
        padding: '32px 20px',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 3D Floating Header Deck */}
        <div
          style={{
            marginBottom: '26px',
            padding: '22px 26px',
            borderRadius: '18px',
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.88), rgba(15, 23, 42, 0.94))',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.16)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '4px solid #070b14',
            boxShadow: '0 20px 35px -15px rgba(0, 0, 0, 0.65)'
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#f8fafc',
              margin: '0 0 6px 0',
              textShadow: '0 3px 12px rgba(0,0,0,0.45)'
            }}
          >
            📚 3D Student Marketplace
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
            Browse textbooks, stationery, and equipment posted for campus students.
          </p>
        </div>

        {message && (
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(6, 95, 70, 0.92), rgba(6, 78, 59, 0.96))',
              color: '#d1fae5',
              padding: '13px 18px',
              borderRadius: '12px',
              marginBottom: '22px',
              fontWeight: '600',
              fontSize: '14px',
              borderTop: '1px solid rgba(52, 211, 153, 0.45)',
              borderBottom: '3px solid #022c22',
              boxShadow: '0 12px 24px -10px rgba(6, 95, 70, 0.6)'
            }}
          >
            {message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))', gap: '22px' }}>
          {products.map((product) => {
            const pid = product._id || product.id;
            return <ProductGridCard3D key={pid} product={product} onAddToCart={handleAddToCart} />;
          })}
        </div>
      </div>
    </div>
  );
}