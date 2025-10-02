import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div
      style={{
        border: '1px solid #e9ecef',
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: 'white',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
      onClick={handleCardClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      <div style={{ position: 'relative' }}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            style={{
              width: '100%',
              height: '220px',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '220px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px',
            color: '#dee2e6'
          }}>
            📷
          </div>
        )}
        {product.isSold && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            판매완료
          </div>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: '#333',
          lineHeight: '1.4'
        }}>
          {product.title}
        </h3>

        <p style={{
          fontWeight: 'bold',
          color: '#FF6B35',
          fontSize: '22px',
          margin: '0 0 16px 0'
        }}>
          {new Intl.NumberFormat('ko-KR').format(product.price)}원
        </p>

        <div style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ marginRight: '8px' }}>📍</span>
          {product.location}
        </div>

        <p style={{
          color: '#666',
          fontSize: '14px',
          lineHeight: '1.5',
          margin: '0 0 16px 0',
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>

        <div style={{
          borderTop: '1px solid #f1f3f4',
          paddingTop: '12px',
          fontSize: '13px',
          color: '#888'
        }}>
          <span>👤 {product.sellerUsername || 'Unknown'}</span>
          <span style={{ float: 'right' }}>
            🕒 {new Date(product.createdAt).toLocaleDateString('ko-KR')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;