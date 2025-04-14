import React from 'react';
import productImg from '../assets/localish-product.jpg';

const Cart: React.FC = () => {
  const cartItems = new Array(10).fill(null).map((_, index) => ({
    id: index,
    name: `Product ${index + 1}`,
    price: 90,
    quantity: Math.floor(Math.random() * 5) + 1,
    image: productImg,
  }));

  return (
    <main
      style={{
        paddingTop: '120px',
        padding: '2rem 4rem',
        fontFamily: 'Montserrat, sans-serif',
        backgroundColor: '#F6EBD9',
        color: '#222', // black text
      }}
    >
      <h1 style={{ fontSize: '36px', marginBottom: '0rem',paddingBottom: '-5rem', color: '#222' }}>Your Cart</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #3E2C14' }}>
            <th style={{ textAlign: 'left', padding: '6.5rem', fontSize: '30px', color: '#222' }}>Product</th>
            <th style={{ textAlign: 'left', padding: '6.5rem', fontSize: '30px', color: '#222' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '6.5rem', fontSize: '30px', color: '#222' }}>Price</th>
            <th style={{ textAlign: 'left', padding: '6.5rem', fontSize: '30px', color: '#222' }}>Qty</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '6.5rem' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    height: '120px',
                    width: '150px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                  }}
                />
              </td>
              <td style={{ padding: '6.5rem', fontSize: '18px' }}>{item.name}</td>
              <td style={{ padding: '6.5rem', fontWeight: 'bold', fontSize: '23px' }}>R{item.price}</td>
              <td style={{ padding: '6.5rem' }}>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  readOnly
                  style={{
                    width: '60px',
                    padding: '0.5rem',
                    fontSize: '16px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    textAlign: 'center',
                    backgroundColor: '#eccccc',
                    color: '#222',
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Cart;
