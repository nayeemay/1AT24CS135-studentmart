import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CartPanel3D({ children, style = {} }) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, hovered: false });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: Number(((0.5 - relY) * 6).toFixed(2)),
      rotateY: Number(((relX - 0.5) * 6).toFixed(2)),
      glowX: Math.round(relX * 100),
      glowY: Math.round(relY * 100),
      hovered: true
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, hovered: false });
  };

  return (
    <div style={{ perspective: '1200px' }}>
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
            ? '0 24px 40px -14px rgba(0, 0, 0, 0.7), 0 0 20px rgba(59, 130, 246, 0.18)'
            : '0 14px 26px -12px rgba(0, 0, 0, 0.58)',
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

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('studentmart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Pre-filled dummy delivery address
  const [address, setAddress] = useState({
    fullName: 'Nayeema Banu',
    phone: '+91 98765 43210',
    hostelOrStreet: 'Room 204, Girls Hostel Block B, Campus Road',
    city: 'Bengaluru',
    pincode: '560001'
  });

  const [placing, setPlacing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem('studentmart_cart', JSON.stringify(cart));
  }, [cart]);

  const downloadInvoice = (order) => {
    if (!order) return;

    const addr = order.customer || {};
    const addressLine = [
      addr.hostelOrStreet || addr.street || addr.line1,
      addr.city,
      addr.pincode ? `- ${addr.pincode}` : ''
    ]
      .filter(Boolean)
      .join(', ');

    const rowsHtml = (order.items || [])
      .map(
        (item) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;">${item.title}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:center;">${item.qty}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;">₹${item.price}</td>
          <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;">₹${Number(item.price) * Number(item.qty)}</td>
        </tr>`
      )
      .join('');

    const invoiceHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice - ${order.id}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #0f172a; padding: 32px; }
    .box { max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 28px; }
    .top { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { font-size: 22px; font-weight: 800; color: #1d4ed8; margin: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th { text-align: left; font-size: 12px; text-transform: uppercase; color: #64748b; padding: 8px 10px; border-bottom: 2px solid #e2e8f0; }
    .total { text-align: right; font-size: 18px; font-weight: 800; margin-top: 18px; color: #0f172a; }
    @media print { body { background: #fff; padding: 0; } .box { border: none; } }
  </style>
</head>
<body>
  <div class="box">
    <div class="top">
      <div>
        <h1 class="brand">StudentMart</h1>
        <p style="margin:4px 0 0;font-size:13px;color:#64748b;">Campus Order Invoice</p>
      </div>
      <div style="text-align:right;font-size:13px;">
        <div><strong>Order ID:</strong> ${order.id}</div>
        <div style="color:#64748b;margin-top:2px;">${order.placedAt || ''}</div>
      </div>
    </div>

    <div style="font-size:13px;line-height:1.6;margin-bottom:18px;">
      <div><strong>Billed To:</strong> ${addr.fullName || addr.name || 'Student Customer'}</div>
      ${addr.phone ? `<div><strong>Phone:</strong> ${addr.phone}</div>` : ''}
      ${addressLine ? `<div><strong>Delivery Address:</strong> ${addressLine}</div>` : ''}
    </div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Price</th>
          <th style="text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>

    <div class="total">Total Amount: ₹${order.total}</div>
  </div>
</body>
</html>`;

    const blob = new Blob([invoiceHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StudentMart-Invoice-${order.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        let street = `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`;
        let city = address.city;
        let pincode = address.pincode;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            street = data.display_name || street;
            city = addr.city || addr.town || addr.village || city;
            pincode = addr.postcode || pincode;
          }
        } catch {
          // Fallback to raw coordinates if reverse geocoding is offline
        }

        setAddress((prev) => ({
          ...prev,
          hostelOrStreet: street,
          city,
          pincode,
          lat: latitude,
          lng: longitude,
          mapUrl
        }));
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        alert('Unable to fetch live location: ' + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const adjustProductStock = (productId, stockDelta) => {
    const products = JSON.parse(localStorage.getItem('studentmart_products') || '[]');
    const updated = products.map((p) =>
      p.id === productId ? { ...p, stock: Math.max(0, (p.stock ?? 0) + stockDelta) } : p
    );
    localStorage.setItem('studentmart_products', JSON.stringify(updated));
    window.dispatchEvent(new Event('studentmart_products_updated'));
  };

  const updateQty = (id, delta) => {
    const target = cart.find((item) => item.id === id);
    if (!target) return;

    if (delta > 0) {
      const products = JSON.parse(localStorage.getItem('studentmart_products') || '[]');
      const prod = products.find((p) => p.id === id);
      if (!prod || (prod.stock ?? 0) <= 0) {
        alert('No more stock available for this item.');
        return;
      }
      adjustProductStock(id, -1);
    } else if (delta < 0) {
      adjustProductStock(id, 1);
    }

    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    const target = cart.find((item) => item.id === id);
    if (target) {
      adjustProductStock(id, target.qty);
    }
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0 || placing) return;

    setPlacing(true);
    const orderId = 'ORD-' + Date.now();
    const placedAt = new Date().toLocaleString();

    const payload = {
      id: orderId,
      orderId,
      placedAt,
      customer: address,
      items: cart.map((item) => ({
        productId: String(item.id),
        title: item.title,
        quantity: Number(item.qty ?? item.quantity ?? 1),
        price: Number(item.price ?? 0)
      })),
      totalAmount,
      status: 'Placed'
    };

    try {
      const res = await fetch('http://localhost:5002/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const savedData = res.ok ? await res.json() : null;

      const newOrder = {
        id: savedData?.orderId || orderId,
        placedAt: savedData?.placedAt || placedAt,
        customer: savedData?.customer || address,
        items: cart,
        total: savedData?.totalAmount ?? totalAmount,
        status: savedData?.status || 'Placed'
      };

      const existingOrders = JSON.parse(localStorage.getItem('studentmart_orders') || '[]');
      localStorage.setItem('studentmart_orders', JSON.stringify([newOrder, ...existingOrders]));
      window.dispatchEvent(new Event('studentmart_orders_updated'));

      setLastOrder(newOrder);
      setCart([]);
      localStorage.removeItem('studentmart_cart');

      alert(`Order ${newOrder.id} placed successfully!`);
    } catch (err) {
      console.error('Order submit error:', err);
      alert('Could not reach backend server at http://localhost:5002. Make sure node server.js is running.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 15% 10%, #1e293b 0%, #0b1120 55%, #060913 100%)',
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
              Shopping Cart 🛒
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
              Review your items and delivery address
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

        {lastOrder && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.14)',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              marginBottom: '18px',
              flexWrap: 'wrap'
            }}
          >
            <span style={{ fontSize: '13.5px', color: '#d1fae5', fontWeight: '600' }}>
              ✅ Order <strong>{lastOrder.id}</strong> placed!
            </span>
            <button
              type="button"
              onClick={() => downloadInvoice(lastOrder)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(96, 165, 250, 0.45)',
                background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              📄 Download Invoice
            </button>
          </div>
        )}

        {cart.length === 0 ? (
          <CartPanel3D style={{ padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '20px' }}>
              Your cart is currently empty.
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
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 10px 20px -6px rgba(37, 99, 235, 0.6)'
              }}
            >
              Browse Marketplace
            </button>
          </CartPanel3D>
        ) : (
          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 3D Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cart.map((item) => (
                <CartPanel3D key={item.id} style={{ padding: '16px 20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', transform: 'translateZ(12px)' }}>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: '56px',
                            height: '56px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.14)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.45)'
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            background: '#090f1d',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            color: '#64748b'
                          }}
                        >
                          No Img
                        </div>
                      )}
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: '700', color: '#f8fafc' }}>
                          {item.title}
                        </h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#34d399', fontWeight: 'bold' }}>
                          ₹{item.price} each
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', transform: 'translateZ(16px)' }}>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          border: 'none',
                          borderTop: '1px solid rgba(255,255,255,0.16)',
                          borderBottom: '3px solid #060913',
                          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                          color: '#fff',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: '800', minWidth: '22px', textAlign: 'center' }}>{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          border: 'none',
                          borderTop: '1px solid rgba(255,255,255,0.16)',
                          borderBottom: '3px solid #060913',
                          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                          color: '#fff',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        +
                      </button>
                      <span
                        style={{
                          marginLeft: '10px',
                          fontWeight: '800',
                          color: '#f8fafc',
                          minWidth: '72px',
                          textAlign: 'right'
                        }}
                      >
                        ₹{item.price * item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        style={{
                          marginLeft: '6px',
                          background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
                          color: '#fff',
                          border: 'none',
                          borderTop: '1px solid rgba(255,255,255,0.28)',
                          borderBottom: '3px solid #991b1b',
                          padding: '7px 13px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          boxShadow: '0 8px 14px -6px rgba(220, 38, 38, 0.55)'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </CartPanel3D>
              ))}
            </div>

            {/* 3D Delivery Address & Live Location Box */}
            <CartPanel3D style={{ padding: '22px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                  📍 Delivery Address
                </h3>
                <button
                  type="button"
                  onClick={handleUseLiveLocation}
                  disabled={locating}
                  style={{
                    background: 'linear-gradient(180deg, #34d399 0%, #059669 100%)',
                    color: '#fff',
                    border: 'none',
                    borderTop: '1px solid rgba(255,255,255,0.35)',
                    borderBottom: '3px solid #047857',
                    padding: '8px 15px',
                    borderRadius: '9px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: locating ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 16px -6px rgba(5, 150, 105, 0.6)'
                  }}
                >
                  {locating ? 'Tracing Location...' : '📡 Use Live Location'}
                </button>
              </div>

              {address.mapUrl && (
                <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#34d399' }}>
                  ✅ Live GPS pinned ({address.lat?.toFixed(5)}, {address.lng?.toFixed(5)}) —{' '}
                  <a
                    href={address.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#60a5fa', textDecoration: 'underline' }}
                  >
                    View on Google Maps
                  </a>
                </p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  required
                  style={recessedInputStyle}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  required
                  style={recessedInputStyle}
                />
                <input
                  type="text"
                  placeholder="Hostel / Street Address"
                  value={address.hostelOrStreet}
                  onChange={(e) => setAddress({ ...address, hostelOrStreet: e.target.value })}
                  required
                  style={{ ...recessedInputStyle, gridColumn: 'span 2' }}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                  style={recessedInputStyle}
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  required
                  style={recessedInputStyle}
                />
              </div>
            </CartPanel3D>

            {/* 3D Total & Place Order Bar */}
            <CartPanel3D style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>Total Amount</span>
                  <h2
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: '26px',
                      fontWeight: '800',
                      color: '#34d399',
                      textShadow: '0 2px 10px rgba(52, 211, 153, 0.25)'
                    }}
                  >
                    ₹{totalAmount}
                  </h2>
                </div>
                <button
                  type="submit"
                  disabled={placing}
                  style={{
                    background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                    color: '#fff',
                    border: 'none',
                    borderTop: '1px solid rgba(255,255,255,0.35)',
                    borderBottom: '4px solid #1d4ed8',
                    padding: '14px 30px',
                    borderRadius: '11px',
                    fontWeight: '800',
                    fontSize: '16px',
                    cursor: placing ? 'not-allowed' : 'pointer',
                    opacity: placing ? 0.7 : 1,
                    boxShadow: '0 12px 22px -6px rgba(37, 99, 235, 0.65)'
                  }}
                >
                  {placing ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </CartPanel3D>
          </form>
        )}
      </div>
    </div>
  );
}