import React, { useState, useEffect } from 'react';

const DEFAULT_PRODUCTS = [
  { id: 1, title: 'colours', price: 50, category: 'Stationary', stock: 20, image: '' },
  { id: 2, title: 'pen', price: 10, category: 'Stationary', stock: 10, image: '' },
  { id: 3, title: 'School Bag', price: 450, category: 'Stationary', stock: 25, image: '' },
  { id: 4, title: 'Books', price: 85, category: 'Books', stock: 100, image: '' },
  { id: 5, title: 'Calculator', price: 1000, category: 'Stationary', stock: 10, image: '' }
];

function AdminPanel3D({ children, style = {}, maxTilt = 4 }) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, hovered: false });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: Number(((0.5 - relY) * maxTilt).toFixed(2)),
      rotateY: Number(((relX - 0.5) * maxTilt).toFixed(2)),
      glowX: Math.round(relX * 100),
      glowY: Math.round(relY * 100),
      hovered: true
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, hovered: false });
  };

  return (
    <div style={{ perspective: '1400px' }}>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          background: 'linear-gradient(155deg, rgba(30, 41, 59, 0.94) 0%, rgba(15, 23, 42, 0.98) 100%)',
          borderRadius: '18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.16)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          borderRight: '1px solid rgba(15, 23, 42, 0.9)',
          borderBottom: '4px solid #070b14',
          transformStyle: 'preserve-3d',
          transform: tilt.hovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-2px)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: tilt.hovered
            ? 'transform 0.08s ease-out, box-shadow 0.2s ease'
            : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease',
          boxShadow: tilt.hovered
            ? '0 24px 40px -14px rgba(0, 0, 0, 0.72), 0 0 20px rgba(59, 130, 246, 0.16)'
            : '0 16px 28px -12px rgba(0, 0, 0, 0.6)',
          ...style
        }}
      >
        <div
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            borderRadius: '18px',
            background: tilt.hovered
              ? `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255, 255, 255, 0.09), transparent 60%)`
              : 'none',
            zIndex: 1
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </div>
    </div>
  );
}

const recessedInputStyle = {
  padding: '12px 14px',
  borderRadius: '11px',
  background: '#0b1120',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  boxShadow: 'inset 0 3px 8px rgba(0, 0, 0, 0.65), 0 1px 0 rgba(255, 255, 255, 0.08)',
  color: '#fff',
  fontSize: '14px',
  outline: 'none'
};

export default function AdminDash() {
  const loadProducts = () => {
    try {
      const saved = localStorage.getItem('studentmart_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore parse errors
    }
    return DEFAULT_PRODUCTS;
  };

  const loadOrders = () => {
    try {
      const saved = localStorage.getItem('studentmart_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const loadMessages = () => {
    try {
      const saved = localStorage.getItem('studentmart_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'users' | 'messages'
  const [products, setProducts] = useState(loadProducts);
  const [orders, setOrders] = useState(loadOrders);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState(loadMessages);
  const [formData, setFormData] = useState({ title: '', price: '', category: '', stock: '', image: '' });
  const [editingId, setEditingId] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  const saveProducts = (nextList) => {
    setProducts(nextList);
    localStorage.setItem('studentmart_products', JSON.stringify(nextList));
    window.dispatchEvent(new Event('studentmart_products_updated'));
  };

  const fetchBackendOrders = async () => {
    try {
      const res = await fetch('http://localhost:5002/api/orders');
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return;

      const normalized = data.map((o) => ({
        id: o.orderId || o._id,
        placedAt: o.placedAt || (o.createdAt ? new Date(o.createdAt).toLocaleString() : ''),
        customer: o.customer || {},
        items: (o.items || []).map((i) => ({
          title: i.title || 'Item',
          qty: i.quantity ?? i.qty ?? 1,
          price: i.price ?? 0
        })),
        total: o.totalAmount ?? o.total ?? 0,
        status: o.status || 'Placed'
      }));

      setOrders(normalized);
      localStorage.setItem('studentmart_orders', JSON.stringify(normalized));
    } catch {
      // Fallback to localStorage orders already loaded
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5002/api/users');
      if (!res.ok) return;
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      // Keep existing users list if backend is unreachable
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('studentmart_products')) {
      localStorage.setItem('studentmart_products', JSON.stringify(products));
    }

    const syncData = () => {
      setProducts(loadProducts());
      setOrders(loadOrders());
      setMessages(loadMessages());
    };

    syncData();
    fetchBackendOrders();
    fetchUsers();

    window.addEventListener('storage', syncData);
    window.addEventListener('studentmart_products_updated', syncData);
    window.addEventListener('studentmart_orders_updated', syncData);

    return () => {
      window.removeEventListener('storage', syncData);
      window.removeEventListener('studentmart_products_updated', syncData);
      window.removeEventListener('studentmart_orders_updated', syncData);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'orders') {
      fetchBackendOrders();
    } else if (activeTab === 'messages') {
      setMessages(loadMessages());
    }
  }, [activeTab]);

  const showBanner = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.price === '') return;

    const cleanImage = (formData.image || '').trim();

    if (editingId !== null) {
      const updatedList = products.map((p) =>
        String(p.id) === String(editingId)
          ? {
              ...p,
              title: formData.title.trim(),
              price: Number(formData.price),
              category: (formData.category || 'General').trim(),
              stock: Number(formData.stock) || 0,
              image: cleanImage
            }
          : p
      );
      saveProducts(updatedList);
      setEditingId(null);
      showBanner('✅ Product & image updated!');
    } else {
      const newProduct = {
        id: Date.now(),
        title: formData.title.trim(),
        price: Number(formData.price),
        category: (formData.category || 'General').trim(),
        stock: Number(formData.stock) || 0,
        image: cleanImage
      };
      saveProducts([...products, newProduct]);
      showBanner('✅ Product added!');
    }

    setFormData({ title: '', price: '', category: '', stock: '', image: '' });
  };

  const handleEdit = (product) => {
    setActiveTab('products');
    setEditingId(product.id);
    setFormData({
      title: product.title ?? '',
      price: product.price ?? '',
      category: product.category ?? '',
      stock: product.stock ?? '',
      image: product.image ?? ''
    });
    setStatusMsg(`Editing "${product.title}" — paste image URL and click Update Product`);
  };

  const handleDelete = (id) => {
    const filtered = products.filter((p) => String(p.id) !== String(id));
    saveProducts(filtered);
    if (String(editingId) === String(id)) {
      setEditingId(null);
      setFormData({ title: '', price: '', category: '', stock: '', image: '' });
    }
    showBanner('🗑️ Product deleted.');
  };

  const handleOrderStatus = async (orderId, newStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    localStorage.setItem('studentmart_orders', JSON.stringify(updated));
    window.dispatchEvent(new Event('studentmart_orders_updated'));

    try {
      await fetch(`http://localhost:5002/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch {
      // Keep local update if backend is offline
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      const res = await fetch(`http://localhost:5002/api/users/${id}/block`, { method: 'PATCH' });
      if (res.ok) {
        const updated = await res.json();
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isBlocked: updated.isBlocked } : u))
        );
        showBanner(updated.isBlocked ? '🚫 User blocked.' : '✅ User unblocked.');
      }
    } catch {
      // Keep current list if backend is offline
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5002/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        showBanner('🗑️ User removed.');
      }
    } catch {
      // Keep current list if backend is offline
    }
  };

  const handleDeleteMessage = (id) => {
    const nextMsgs = messages.filter((m) => m.id !== id);
    setMessages(nextMsgs);
    localStorage.setItem('studentmart_messages', JSON.stringify(nextMsgs));
    showBanner('🗑️ Message removed.');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
    localStorage.removeItem('isAdmin');
    window.location.href = '/admin-login';
  };

  const navItems = [
    { id: 'products', label: '📦 Manage Products', count: products.length },
    { id: 'orders', label: '🧾 Manage Orders', count: orders.length },
    { id: 'users', label: '👥 Manage Users', count: users.length },
    { id: 'messages', label: '✉️ Contact Inbox', count: messages.length }
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        background: 'radial-gradient(circle at 18% 12%, #1e293b 0%, #0b1120 55%, #060913 100%)',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      {/* 3D ELEVATED ADMIN SIDEBAR */}
      <aside
        style={{
          width: '268px',
          flexShrink: 0,
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.92) 0%, rgba(15, 23, 42, 0.97) 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '12px 0 32px rgba(0, 0, 0, 0.55)',
          padding: '28px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}
      >
        <div>
          <div
            style={{
              padding: '14px',
              borderRadius: '14px',
              background: 'rgba(15, 23, 42, 0.75)',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              borderBottom: '3px solid #060913',
              marginBottom: '24px'
            }}
          >
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#f8fafc' }}>Admin Panel</h2>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>StudentMart 3D Controls</p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    borderRadius: '11px',
                    border: 'none',
                    borderTop: active
                      ? '1px solid rgba(255, 255, 255, 0.35)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderBottom: active ? '3px solid #1d4ed8' : '3px solid #070b14',
                    cursor: 'pointer',
                    fontWeight: active ? '700' : '600',
                    fontSize: '14px',
                    textAlign: 'left',
                    background: active
                      ? 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)'
                      : 'linear-gradient(180deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    color: active ? '#ffffff' : '#cbd5e1',
                    boxShadow: active
                      ? '0 10px 18px -6px rgba(37, 99, 235, 0.55)'
                      : '0 6px 12px -6px rgba(0, 0, 0, 0.45)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <span>{item.label}</span>
                  <span
                    style={{
                      background: active ? 'rgba(255,255,255,0.22)' : '#090f1d',
                      color: active ? '#fff' : '#94a3b8',
                      padding: '2px 9px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: '700'
                    }}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
            color: '#fff',
            border: 'none',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)',
            borderBottom: '3px solid #991b1b',
            padding: '11px 16px',
            borderRadius: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            width: '100%',
            boxShadow: '0 10px 18px -6px rgba(220, 38, 38, 0.55)'
          }}
        >
          Logout
        </button>
      </aside>

      {/* MAIN 3D CONTENT AREA */}
      <main style={{ flex: 1, padding: '36px 26px', overflowY: 'auto', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          {/* 3D Floating Header Deck */}
          <div
            style={{
              marginBottom: '26px',
              padding: '22px 26px',
              borderRadius: '18px',
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.94))',
              borderTop: '1px solid rgba(255, 255, 255, 0.16)',
              borderBottom: '4px solid #070b14',
              boxShadow: '0 20px 35px -15px rgba(0, 0, 0, 0.65)'
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: '800',
                color: '#f8fafc',
                textShadow: '0 3px 12px rgba(0, 0, 0, 0.45)'
              }}
            >
              {activeTab === 'products' && 'Manage Products'}
              {activeTab === 'orders' && 'Manage Orders'}
              {activeTab === 'users' && 'Manage Users'}
              {activeTab === 'messages' && 'Contact Us Inbox'}
            </h1>
            <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
              StudentMart 3D Admin Control Center
            </p>
          </div>

          {statusMsg && (
            <div
              style={{
                background: 'linear-gradient(145deg, rgba(30, 58, 138, 0.9), rgba(23, 37, 84, 0.95))',
                borderTop: '1px solid rgba(96, 165, 250, 0.45)',
                borderBottom: '3px solid #172554',
                color: '#dbeafe',
                padding: '13px 18px',
                borderRadius: '12px',
                marginBottom: '22px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 12px 24px -10px rgba(30, 58, 138, 0.6)'
              }}
            >
              {statusMsg}
            </div>
          )}

          {/* TAB 1: MANAGE PRODUCTS */}
          {activeTab === 'products' && (
            <>
              <AdminPanel3D style={{ padding: '24px', marginBottom: '28px' }} maxTilt={3}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                  {editingId !== null ? '✏️ Edit Product' : '➕ Add New Product'}
                </h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Product Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    style={recessedInputStyle}
                  />
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    style={recessedInputStyle}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={recessedInputStyle}
                  />
                  <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    style={recessedInputStyle}
                  />
                  <input
                    type="text"
                    placeholder="Direct Image URL (e.g. https://.../photo.jpg)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    style={{ ...recessedInputStyle, gridColumn: 'span 2' }}
                  />
                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                        color: '#fff',
                        border: 'none',
                        borderTop: '1px solid rgba(255,255,255,0.35)',
                        borderBottom: '4px solid #1d4ed8',
                        padding: '12px 24px',
                        borderRadius: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        flex: 1,
                        boxShadow: '0 10px 20px -6px rgba(37, 99, 235, 0.6)'
                      }}
                    >
                      {editingId !== null ? 'Update Product' : 'Add Product'}
                    </button>
                    {editingId !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({ title: '', price: '', category: '', stock: '', image: '' });
                          setStatusMsg('');
                        }}
                        style={{
                          background: 'linear-gradient(180deg, #64748b 0%, #475569 100%)',
                          color: '#fff',
                          border: 'none',
                          borderTop: '1px solid rgba(255,255,255,0.2)',
                          borderBottom: '4px solid #1e293b',
                          padding: '12px 20px',
                          borderRadius: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </AdminPanel3D>

              <AdminPanel3D style={{ padding: '24px' }} maxTilt={2}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                  📦 Product Inventory ({products.length})
                </h3>
                {products.length === 0 ? (
                  <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No products available. Add one above!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {products.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: 'linear-gradient(145deg, #111827 0%, #090f1d 100%)',
                          padding: '14px 18px',
                          borderRadius: '13px',
                          borderTop: '1px solid rgba(255,255,255,0.1)',
                          borderBottom: '3px solid #04070e',
                          boxShadow: '0 10px 18px -8px rgba(0,0,0,0.6)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          {p.image ? (
                            <img
                              key={`${p.id}-${p.image}`}
                              src={p.image}
                              alt={p.title}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
                              }}
                              style={{
                                width: '48px',
                                height: '48px',
                                objectFit: 'cover',
                                borderRadius: '9px',
                                border: '1px solid rgba(255,255,255,0.12)'
                              }}
                            />
                          ) : null}
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              background: '#1e293b',
                              borderRadius: '9px',
                              display: p.image ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              color: '#94a3b8'
                            }}
                          >
                            No Img
                          </div>
                          <div>
                            <h4 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '16px', fontWeight: '700' }}>
                              {p.title}
                            </h4>
                            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                              ₹{p.price} • <span style={{ color: '#60a5fa' }}>{p.category || 'General'}</span> • Stock:{' '}
                              <span style={{ color: p.stock > 0 ? '#34d399' : '#f87171', fontWeight: '600' }}>{p.stock}</span>
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleEdit(p)}
                            style={{
                              background: 'linear-gradient(180deg, #facc15 0%, #eab308 100%)',
                              color: '#000',
                              border: 'none',
                              borderTop: '1px solid rgba(255,255,255,0.45)',
                              borderBottom: '3px solid #a16207',
                              padding: '7px 13px',
                              borderRadius: '8px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            style={{
                              background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
                              color: '#fff',
                              border: 'none',
                              borderTop: '1px solid rgba(255,255,255,0.3)',
                              borderBottom: '3px solid #991b1b',
                              padding: '7px 13px',
                              borderRadius: '8px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AdminPanel3D>
            </>
          )}

          {/* TAB 2: MANAGE ORDERS */}
          {activeTab === 'orders' && (
            <AdminPanel3D style={{ padding: '24px' }} maxTilt={2}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                🧾 Customer Orders ({orders.length})
              </h3>
              {orders.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No customer orders yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {orders.map((order) => {
                    const customerName =
                      order.customer?.fullName ||
                      order.customer?.name ||
                      order.user?.name ||
                      order.user?.email ||
                      'Student Customer';
                    const customerPhone = order.customer?.phone || order.phone || '';
                    const customerEmail = order.customer?.email || order.user?.email || '';
                    const addr = order.customer || order.address || {};
                    const fullAddress = [
                      addr.hostelOrStreet || addr.street || addr.line1,
                      addr.city,
                      addr.pincode ? `- ${addr.pincode}` : ''
                    ]
                      .filter(Boolean)
                      .join(', ');

                    return (
                      <div
                        key={order.id}
                        style={{
                          background: 'linear-gradient(145deg, #111827 0%, #090f1d 100%)',
                          padding: '18px 20px',
                          borderRadius: '14px',
                          borderTop: '1px solid rgba(255,255,255,0.1)',
                          borderBottom: '3px solid #04070e',
                          boxShadow: '0 10px 18px -8px rgba(0,0,0,0.6)'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginBottom: '12px'
                          }}
                        >
                          <div>
                            <strong style={{ color: '#60a5fa', fontSize: '15px' }}>{order.id}</strong>
                            <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '10px' }}>
                              {order.placedAt || order.date || ''}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <strong style={{ color: '#34d399', fontSize: '16px' }}>₹{order.total}</strong>
                            <select
                              value={order.status || 'Placed'}
                              onChange={(e) => handleOrderStatus(order.id, e.target.value)}
                              style={{
                                background: '#1e293b',
                                color: '#fff',
                                border: '1px solid rgba(148, 163, 184, 0.35)',
                                borderRadius: '8px',
                                padding: '5px 10px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="Placed">Placed</option>
                              <option value="Packed">Packed</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </div>

                        <div
                          style={{
                            background: '#0b1120',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            marginBottom: '10px',
                            border: '1px solid rgba(148, 163, 184, 0.16)',
                            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.55)'
                          }}
                        >
                          <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#f8fafc' }}>
                            <strong>Placed By:</strong> {customerName}
                            {customerPhone && <span style={{ color: '#94a3b8' }}> • {customerPhone}</span>}
                            {customerEmail && <span style={{ color: '#60a5fa' }}> ({customerEmail})</span>}
                          </p>
                          <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1' }}>
                            <strong>Delivery Address:</strong> {fullAddress || 'Address not provided'}
                            {addr.mapUrl && (
                              <>
                                {' '}
                                —{' '}
                                <a
                                  href={addr.mapUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ color: '#34d399', fontWeight: '600', textDecoration: 'underline' }}
                                >
                                  📡 View Live GPS Pin
                                </a>
                              </>
                            )}
                          </p>
                        </div>

                        <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#e2e8f0' }}>
                          <strong>Items:</strong> {order.items?.map((i) => `${i.title} (x${i.qty})`).join(', ')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </AdminPanel3D>
          )}

          {/* TAB 3: MANAGE USERS */}
          {activeTab === 'users' && (
            <AdminPanel3D style={{ padding: '24px' }} maxTilt={2}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                👥 Registered Users ({users.length})
              </h3>
              {users.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No registered users found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {users.map((u) => (
                    <div
                      key={u._id}
                      style={{
                        background: 'linear-gradient(145deg, #111827 0%, #090f1d 100%)',
                        padding: '16px 18px',
                        borderRadius: '13px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        borderBottom: '3px solid #04070e',
                        boxShadow: '0 10px 18px -8px rgba(0,0,0,0.6)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '15px', color: '#f8fafc' }}>{u.name}</strong>
                          {u.usn && (
                            <span
                              style={{
                                fontSize: '12px',
                                background: '#1e293b',
                                color: '#60a5fa',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                border: '1px solid rgba(96, 165, 250, 0.3)'
                              }}
                            >
                              {u.usn}
                            </span>
                          )}
                          {u.isBlocked && (
                            <span
                              style={{
                                fontSize: '11px',
                                background: '#7f1d1d',
                                color: '#fca5a5',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontWeight: 'bold'
                              }}
                            >
                              BLOCKED
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
                          {u.email}
                          {u.clg ? ` • ${u.clg}` : ''}
                          {u.sec ? ` • Sec: ${u.sec}` : ''}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(u._id)}
                          style={{
                            background: u.isBlocked
                              ? 'linear-gradient(180deg, #34d399 0%, #059669 100%)'
                              : 'linear-gradient(180deg, #fbbf24 0%, #d97706 100%)',
                            color: '#fff',
                            border: 'none',
                            borderTop: '1px solid rgba(255,255,255,0.3)',
                            borderBottom: u.isBlocked ? '3px solid #047857' : '3px solid #92400e',
                            padding: '7px 13px',
                            borderRadius: '8px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          {u.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u._id)}
                          style={{
                            background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
                            color: '#fff',
                            border: 'none',
                            borderTop: '1px solid rgba(255,255,255,0.3)',
                            borderBottom: '3px solid #991b1b',
                            padding: '7px 13px',
                            borderRadius: '8px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AdminPanel3D>
          )}

          {/* TAB 4: CONTACT US INBOX */}
          {activeTab === 'messages' && (
            <AdminPanel3D style={{ padding: '24px' }} maxTilt={2}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                ✉️ Contact Us Inquiries ({messages.length})
              </h3>
              {messages.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
                  No contact messages yet. Submissions from Contact Us will appear here.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        background: 'linear-gradient(145deg, #111827 0%, #090f1d 100%)',
                        padding: '16px 18px',
                        borderRadius: '13px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        borderBottom: '3px solid #04070e',
                        boxShadow: '0 10px 18px -8px rgba(0,0,0,0.6)'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px',
                          marginBottom: '6px'
                        }}
                      >
                        <div>
                          <strong style={{ color: '#60a5fa', fontSize: '14px' }}>{m.name}</strong>
                          <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '8px' }}>({m.email})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>{m.date}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(m.id)}
                            style={{
                              background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
                              color: '#fff',
                              border: 'none',
                              borderTop: '1px solid rgba(255,255,255,0.3)',
                              borderBottom: '3px solid #991b1b',
                              padding: '5px 10px',
                              borderRadius: '7px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              fontSize: '11px'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {m.subject && (
                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#f8fafc', marginBottom: '4px' }}>
                          {m.subject}
                        </div>
                      )}
                      <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>{m.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </AdminPanel3D>
          )}
        </div>
      </main>
    </div>
  );
}