import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OrderCard3D({ children, style = {}, maxTilt = 5 }) {
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
    <div style={{ perspective: '1300px' }}>
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
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-3px)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: tilt.hovered
            ? 'transform 0.08s ease-out, box-shadow 0.2s ease'
            : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease',
          boxShadow: tilt.hovered
            ? '0 24px 40px -14px rgba(0, 0, 0, 0.72), 0 0 22px rgba(59, 130, 246, 0.18)'
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
              ? `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255, 255, 255, 0.1), transparent 60%)`
              : 'none',
            zIndex: 1
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </div>
    </div>
  );
}

const getStatusStyle = (status) => {
  if (status === 'Delivered') {
    return {
      background: 'rgba(16, 185, 129, 0.16)',
      color: '#6ee7b7',
      border: '1px solid rgba(52, 211, 153, 0.35)'
    };
  }
  if (status === 'Packed') {
    return {
      background: 'rgba(245, 158, 11, 0.16)',
      color: '#fcd34d',
      border: '1px solid rgba(251, 191, 36, 0.35)'
    };
  }
  return {
    background: 'rgba(59, 130, 246, 0.16)',
    color: '#93c5fd',
    border: '1px solid rgba(96, 165, 250, 0.35)'
  };
};

export default function Order() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('studentmart_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const loadOrders = async () => {
    try {
      const res = await fetch('http://localhost:5002/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
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
          return;
        }
      }
    } catch {
      // Fallback to localStorage
    }

    try {
      const saved = localStorage.getItem('studentmart_orders');
      setOrders(saved ? JSON.parse(saved) : []);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener('studentmart_orders_updated', loadOrders);
    window.addEventListener('storage', loadOrders);
    return () => {
      window.removeEventListener('studentmart_orders_updated', loadOrders);
      window.removeEventListener('storage', loadOrders);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 18% 12%, #1e293b 0%, #0b1120 55%, #060913 100%)',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        padding: '32px 20px'
      }}
    >
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        {/* 3D Floating Header Deck */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '26px',
            padding: '20px 24px',
            borderRadius: '18px',
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.88), rgba(15, 23, 42, 0.94))',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.16)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '4px solid #070b14',
            boxShadow: '0 20px 35px -15px rgba(0, 0, 0, 0.65)',
            flexWrap: 'wrap',
            gap: '12px'
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
              My Orders 📦
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
              Track your placed orders and live status
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/products')}
            style={{
              background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
              color: '#f1f5f9',
              border: 'none',
              borderTop: '1px solid rgba(255,255,255,0.18)',
              borderBottom: '3px solid #090d16',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 8px 16px -6px rgba(0,0,0,0.5)'
            }}
          >
            ← Back to Products
          </button>
        </div>

        {orders.length === 0 ? (
          <OrderCard3D style={{ padding: '44px 24px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '18px' }}>
              You haven&apos;t placed any orders yet.
            </p>
            <button
              type="button"
              onClick={() => navigate('/products')}
              style={{
                background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                color: '#fff',
                border: 'none',
                borderTop: '1px solid rgba(255,255,255,0.35)',
                borderBottom: '3px solid #1d4ed8',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 10px 20px -6px rgba(37, 99, 235, 0.6)'
              }}
            >
              Shop Now
            </button>
          </OrderCard3D>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => {
              const statusStyle = getStatusStyle(order.status || 'Placed');
              return (
                <OrderCard3D key={order.id} style={{ padding: '20px 22px' }}>
                  <div style={{ transform: 'translateZ(12px)' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px',
                        marginBottom: '12px'
                      }}
                    >
                      <div>
                        <strong style={{ color: '#60a5fa', fontSize: '15px' }}>{order.id}</strong>
                        <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '10px' }}>
                          {order.placedAt}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            ...statusStyle,
                            padding: '4px 11px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: '700',
                            boxShadow: '0 6px 12px rgba(0,0,0,0.35)'
                          }}
                        >
                          {order.status || 'Placed'}
                        </span>
                        <strong
                          style={{
                            color: '#34d399',
                            fontSize: '17px',
                            fontWeight: '800',
                            textShadow: '0 2px 10px rgba(52, 211, 153, 0.25)'
                          }}
                        >
                          ₹{order.total}
                        </strong>
                      </div>
                    </div>

                    {order.customer?.fullName && (
                      <div
                        style={{
                          background: '#0b1120',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          marginBottom: '10px',
                          border: '1px solid rgba(148, 163, 184, 0.16)',
                          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.55)',
                          fontSize: '13px',
                          color: '#cbd5e1'
                        }}
                      >
                        <strong>Deliver To:</strong> {order.customer.fullName} • {order.customer.hostelOrStreet},{' '}
                        {order.customer.city} - {order.customer.pincode}
                        {order.customer.mapUrl && (
                          <>
                            {' '}
                            —{' '}
                            <a
                              href={order.customer.mapUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: '#34d399', fontWeight: '600', textDecoration: 'underline' }}
                            >
                              📡 Map Pin
                            </a>
                          </>
                        )}
                      </div>
                    )}

                    <p style={{ margin: '6px 0 0 0', fontSize: '13.5px', color: '#e2e8f0' }}>
                      <strong>Items:</strong> {order.items?.map((i) => `${i.title} (x${i.qty})`).join(', ')}
                    </p>
                  </div>
                </OrderCard3D>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}