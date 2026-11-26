import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_STARTER_PRODUCTS = [
  {
    id: 'starter-1',
    title: 'Engineering Mathematics Textbook',
    price: 450,
    category: 'Books',
    stock: 8,
    description: 'Clean condition, essential for semester exams.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'starter-2',
    title: 'Casio fx-991ES Plus Calculator',
    price: 850,
    category: 'Electronics',
    stock: 5,
    description: 'Scientific calculator approved for university exams.',
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'starter-3',
    title: 'Campus Gel Pen & Notebook Pack',
    price: 120,
    category: 'Stationary',
    stock: 15,
    description: 'Smooth writing pens and ruled semester notebooks.',
    image: ''
  }
];

function ProductCard3D({ product, outOfStock, onAddToCart }) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, hovered: false });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: Number(((0.5 - relY) * 12).toFixed(2)),
      rotateY: Number(((relX - 0.5) * 12).toFixed(2)),
      glowX: Math.round(relX * 100),
      glowY: Math.round(relY * 100),
      hovered: true
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, hovered: false });
  };

  return (
    <div style={{ perspective: '1100px' }}>
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
          justifyContent: 'space-between',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: tilt.hovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-6px) scale(1.015)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
          transition: tilt.hovered
            ? 'transform 0.08s ease-out, box-shadow 0.2s ease'
            : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease',
          boxShadow: tilt.hovered
            ? '0 28px 45px -12px rgba(0, 0, 0, 0.7), 0 0 24px rgba(59, 130, 246, 0.22)'
            : '0 14px 26px -10px rgba(0, 0, 0, 0.55)'
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
                alt={product.title}
                style={{
                  width: '100%',
                  height: '165px',
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
                  height: '165px',
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
                background: 'rgba(15, 23, 42, 0.82)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(96, 165, 250, 0.35)',
                boxShadow: '0 6px 14px rgba(0, 0, 0, 0.45)'
              }}
            >
              {product.category || 'General'}
            </span>
          </div>

          {/* Product Info Layer */}
          <div style={{ padding: '16px 18px 12px 18px' }}>
            <h3
              style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#f8fafc',
                textShadow: '0 2px 6px rgba(0,0,0,0.4)'
              }}
            >
              {product.title}
            </h3>

            {product.description && (
              <p style={{ margin: '0 0 8px 0', fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.4 }}>
                {product.description}
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#34d399',
                  textShadow: '0 2px 10px rgba(52, 211, 153, 0.25)'
                }}
              >
                ₹{product.price}
              </span>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '4px 9px',
                  borderRadius: '8px',
                  background: outOfStock ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.14)',
                  border: outOfStock ? '1px solid rgba(248, 113, 113, 0.3)' : '1px solid rgba(52, 211, 153, 0.28)',
                  color: outOfStock ? '#fca5a5' : '#6ee7b7'
                }}
              >
                {outOfStock ? 'Out of stock' : `Stock: ${product.stock}`}
              </span>
            </div>
          </div>
        </div>

        {/* Tactile 3D Push Button */}
        <div style={{ padding: '0 18px 18px 18px', transform: 'translateZ(24px)', position: 'relative', zIndex: 3 }}>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={outOfStock}
            onMouseDown={(e) => {
              if (!outOfStock) e.currentTarget.style.transform = 'translateY(3px)';
            }}
            onMouseUp={(e) => {
              if (!outOfStock) e.currentTarget.style.transform = 'translateY(0px)';
            }}
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: '11px',
              border: 'none',
              borderTop: outOfStock ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.35)',
              borderBottom: outOfStock ? '3px solid #1e293b' : '4px solid #1d4ed8',
              fontWeight: '700',
              fontSize: '14px',
              letterSpacing: '0.2px',
              cursor: outOfStock ? 'not-allowed' : 'pointer',
              background: outOfStock
                ? '#334155'
                : 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
              color: outOfStock ? '#94a3b8' : '#ffffff',
              boxShadow: outOfStock
                ? 'none'
                : '0 10px 18px -6px rgba(37, 99, 235, 0.65)',
              transition: 'transform 0.1s ease, box-shadow 0.2s ease'
            }}
          >
            {outOfStock ? 'Unavailable' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

const BASE_CATEGORIES = ['All', 'Books', 'Electronics', 'Stationary'];

export default function Products() {
  const navigate = useNavigate();

  const mergeAndNormalize = (apiList = []) => {
    const savedMarket = JSON.parse(localStorage.getItem('studentmart_products') || '[]');
    const savedCustom = JSON.parse(localStorage.getItem('customProducts') || '[]');

    const combined = [...savedCustom, ...savedMarket, ...apiList];
    const sourceList = combined.length > 0 ? combined : DEFAULT_STARTER_PRODUCTS;

    const seenIds = new Set();
    const normalized = sourceList
      .map((item, idx) => ({
        ...item,
        id: item.id || item._id || `prod-${idx}`,
        title: item.title || item.name || 'Untitled Product',
        price: Number(item.price) || 0,
        stock: item.stock ?? 10,
        category: item.category || 'General'
      }))
      .filter((item) => {
        const key = String(item.id);
        if (seenIds.has(key)) return false;
        seenIds.add(key);
        return true;
      });

    localStorage.setItem('studentmart_products', JSON.stringify(normalized));
    return normalized;
  };

  const [products, setProducts] = useState(() => mergeAndNormalize());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('studentmart_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const syncFromApiAndLocal = async () => {
      try {
        const res = await fetch('http://localhost:5002/api/products');
        if (res.ok) {
          const apiData = await res.json();
          const list = Array.isArray(apiData) ? apiData : apiData.products || [];
          setProducts(mergeAndNormalize(list));
          return;
        }
      } catch {
        // Backend offline -> use localStorage / starter products
      }
      setProducts(mergeAndNormalize());
    };

    syncFromApiAndLocal();

    const handleLocalUpdate = () => setProducts(mergeAndNormalize());
    window.addEventListener('storage', handleLocalUpdate);
    window.addEventListener('studentmart_products_updated', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleLocalUpdate);
      window.removeEventListener('studentmart_products_updated', handleLocalUpdate);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('studentmart_cart', JSON.stringify(cart));
  }, [cart]);

  const extraCategories = [
    ...new Set(
      products
        .map((p) => (p.category || 'General').trim())
        .filter(
          (cat) =>
            cat &&
            !BASE_CATEGORIES.some((base) => base.toLowerCase() === cat.toLowerCase())
        )
    )
  ];
  const categories = [...BASE_CATEGORIES, ...extraCategories];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = (p.title || '').toLowerCase().includes(search.toLowerCase());
    const itemCategory = (p.category || 'General').trim().toLowerCase();
    const matchesCategory =
      selectedCategory === 'All' || itemCategory === selectedCategory.trim().toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    const currentStock = product.stock ?? 0;
    if (currentStock <= 0) return;

    const updatedProducts = products.map((p) =>
      p.id === product.id ? { ...p, stock: Math.max(0, (p.stock ?? 0) - 1) } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('studentmart_products', JSON.stringify(updatedProducts));

    const savedCustom = JSON.parse(localStorage.getItem('customProducts') || '[]');
    if (savedCustom.length > 0) {
      const updatedCustom = savedCustom.map((c) =>
        (c.id || c._id) === product.id ? { ...c, stock: Math.max(0, (c.stock ?? 0) - 1) } : c
      );
      localStorage.setItem('customProducts', JSON.stringify(updatedCustom));
    }

    window.dispatchEvent(new Event('studentmart_products_updated'));

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div
      style={{
        minHeight: '100vh',
        marginLeft: '248px',
        width: 'calc(100% - 248px)',
        boxSizing: 'border-box',
        background: 'radial-gradient(circle at 15% 10%, #1e293b 0%, #0b1120 55%, #060913 100%)',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        padding: '32px 24px'
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        {/* 3D Floating Header Deck */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '26px',
            padding: '20px 24px',
            borderRadius: '18px',
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.92))',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.16)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '4px solid #070b14',
            boxShadow: '0 20px 35px -15px rgba(0, 0, 0, 0.65)',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: '800',
                letterSpacing: '-0.3px',
                color: '#f8fafc',
                textShadow: '0 3px 12px rgba(0,0,0,0.45)'
              }}
            >
              StudentMart 3D Marketplace
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
              Browse campus essentials &amp; supplies
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
                color: '#f1f5f9',
                border: 'none',
                borderTop: '1px solid rgba(255,255,255,0.18)',
                borderBottom: '3px solid #090d16',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 8px 16px -6px rgba(0,0,0,0.5)'
              }}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate('/add-product')}
              style={{
                background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
                color: '#f1f5f9',
                border: 'none',
                borderTop: '1px solid rgba(255,255,255,0.18)',
                borderBottom: '3px solid #090d16',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 8px 16px -6px rgba(0,0,0,0.5)'
              }}
            >
              ➕ List Product
            </button>
            <button
              type="button"
              onClick={() => navigate('/orders')}
              style={{
                background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
                color: '#f1f5f9',
                border: 'none',
                borderTop: '1px solid rgba(255,255,255,0.18)',
                borderBottom: '3px solid #090d16',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 8px 16px -6px rgba(0,0,0,0.5)'
              }}
            >
              📦 My Orders
            </button>
            <button
              type="button"
              onClick={() => navigate('/cart')}
              style={{
                background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                color: '#fff',
                border: 'none',
                borderTop: '1px solid rgba(255,255,255,0.35)',
                borderBottom: '3px solid #1d4ed8',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 10px 20px -6px rgba(37, 99, 235, 0.6)'
              }}
            >
              🛒 Cart ({totalCartItems})
            </button>
          </div>
        </div>

        {/* Recessed 3D Search & Raised Category Pills */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: '240px',
              padding: '13px 16px',
              borderRadius: '12px',
              background: '#0b1120',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              boxShadow: 'inset 0 3px 8px rgba(0, 0, 0, 0.65), 0 1px 0 rgba(255, 255, 255, 0.08)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    borderTop: isSelected
                      ? '1px solid rgba(255,255,255,0.35)'
                      : '1px solid rgba(255,255,255,0.12)',
                    borderBottom: isSelected ? '3px solid #1d4ed8' : '3px solid #090d16',
                    background: isSelected
                      ? 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)'
                      : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transform: isSelected ? 'translateY(-1px)' : 'translateY(0)',
                    boxShadow: isSelected
                      ? '0 8px 16px -4px rgba(37, 99, 235, 0.5)'
                      : '0 6px 12px -4px rgba(0, 0, 0, 0.45)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Product Grid */}
        {filteredProducts.length === 0 ? (
          <div
            style={{
              background: 'linear-gradient(145deg, #1e293b, #0f172a)',
              padding: '48px',
              borderRadius: '18px',
              textAlign: 'center',
              borderTop: '1px solid rgba(255,255,255,0.12)',
              borderBottom: '4px solid #070b14',
              boxShadow: '0 20px 35px -15px rgba(0,0,0,0.6)',
              color: '#94a3b8'
            }}
          >
            No products match your search or category filter.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '22px' }}>
            {filteredProducts.map((p) => (
              <ProductCard3D
                key={p.id}
                product={p}
                outOfStock={(p.stock ?? 0) <= 0}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}