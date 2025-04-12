import React, { useState } from 'react';
import productImg from '../assets/localish-product.jpg';

const Home: React.FC = () => {
  const products: null[] = new Array(10).fill(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const visibleCount: number = 5; // how many products show at once
  const cardWidth: number = 240; // pixel width of each card including margin

  const maxIndex: number = Math.ceil(products.length / visibleCount) - 1;

  const scrollTo = (direction: 'left' | 'right') => {
    setCurrentIndex((prev) => {
      if (direction === 'left') return Math.max(prev - 1, 0);
      if (direction === 'right') return Math.min(prev + 1, maxIndex);
      return prev;
    });
  };

  return (
    <main style={{ paddingTop: '100px', paddingLeft: '50px', paddingRight: '0' }}>
      <section>
        {/* Heading and arrows */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h1
            style={{
              fontSize: '40px',
              fontFamily: 'Montserrat, sans-serif',
              color: '#3E2C14',
            }}
          >
            Top 10 Products
          </h1>
          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => scrollTo('left')}
              disabled={currentIndex === 0}
              style={{
                background: '#ddd',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                color: 'black',
                height: '36px',
                fontSize: '1.2rem',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                
              }}
            >
              ‹
            </button>
            <button
              onClick={() => scrollTo('right')}
              disabled={currentIndex === maxIndex}
              style={{
                background: '#ddd',
                border: 'none',
                color: 'black',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '1.2rem',
                cursor: currentIndex === maxIndex ? 'not-allowed' : 'pointer',
              }}
            >
              ›
            </button>
          </nav>
        </header>

        {/* Carousel */}
        <section
          style={{
            overflow: 'hidden',
            width: `${visibleCount * cardWidth}px`,
          }}
        >
          <ul
            style={{
              display: 'flex',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              gap: '1.5rem',
              transition: 'transform 0.3s ease-in-out',
              transform: `translateX(-${currentIndex * (cardWidth + 24) * visibleCount}px)`,
              width: 'max-content',
            }}
          >
            {products.map((_, index) => (
              <li key={index} style={{ width: `${cardWidth}px`, flexShrink: 0 }}>
                <article
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    height: '320px',
                    padding: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    textAlign: 'left',
                  }}
                >
                  <figure style={{ margin: 0 }}>
                    <img
                      src={productImg}
                      alt="Product"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginBottom: '0.5rem',
                      }}
                    />
                    <figcaption>
                      <p
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          margin: '0 0 0.25rem',
                          color: '#666',
                        }}
                      >
                        Artwork Title
                      </p>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#666',
                          margin: '0 0 0.5rem',
                        }}
                      >
                        Artist Name
                      </p>
                      <p
                        style={{
                          fontWeight: '500',
                          fontSize: '0.8rem',
                          margin: 0,
                          color: '#666',
                        }}
                      >
                        R69
                      </p>
                    </figcaption>
                  </figure>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
};

export default Home;
