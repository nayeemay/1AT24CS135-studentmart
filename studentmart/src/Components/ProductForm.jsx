import React, { useState } from 'react';

export default function ProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5002/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          price: Number(price), 
          category, 
          stock: Number(stock) || 10, 
          image, 
          description 
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Product added successfully!');
        setName('');
        setPrice('');
        setCategory('');
        setStock('');
        setImage('');
        setDescription('');
        window.location.reload();
      } else {
        setMessage(data.message || 'Error adding product');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {message && <p style={{ fontSize: '13px', color: message.includes('success') ? 'green' : 'red', margin: 0 }}>{message}</p>}
      <input 
        type="text" 
        placeholder="Product Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required
        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
      />
      <input 
        type="number" 
        placeholder="Price (₹)" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
        required
        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
      />
      <input 
        type="text" 
        placeholder="Category" 
        value={category} 
        onChange={(e) => setCategory(e.target.value)} 
        required
        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
      />
      <input 
        type="number" 
        placeholder="Stock Available (e.g., 15)" 
        value={stock} 
        onChange={(e) => setStock(e.target.value)} 
        required
        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
      />
      <input 
        type="url" 
        placeholder="Image URL (e.g., https://example.com/image.jpg)" 
        value={image} 
        onChange={(e) => setImage(e.target.value)} 
        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
      />
      <textarea 
        placeholder="Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        required
        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', minHeight: '80px' }}
      />
      <button 
        type="submit" 
        style={{ backgroundColor: '#111827', color: '#ffffff', padding: '10px', borderRadius: '8px', fontWeight: '650', border: 'none', cursor: 'pointer' }}
      >
        Add Product
      </button>
    </form>
  );
}