import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';
import Header from '../components/common/Header';
import api from '../services/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('API 호출 시작...');

        const data = await api.get('/api/products');
        console.log('API 응답:', data);

        setProducts(data.data || data);
        setError(null);
      } catch (err) {
        console.error('API 에러:', err);
        setError('상품 목록을 불러오는데 실패했습니다: ' + err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductCreate = () => {
    console.log('상품 등록 버튼 클릭됨');
    console.log('인증 상태:', isAuthenticated());
    
    if (!isAuthenticated()) {
      alert('상품을 등록하려면 먼저 로그인해주세요.');
      return;
    }
    
    console.log('ProductCreate 페이지로 이동...');
    navigate('/products/create');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '6px solid #f3f3f3',
          borderTop: '6px solid #FF6B35',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: '#666', fontSize: '18px' }}>
          백엔드 API에서 데이터를 불러오는 중...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <Header />

        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          color: '#c33',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>❌ 백엔드 연결 실패</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#FF6B35',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🔄 다시 시도
          </button>
        </div>

        <div style={{
          backgroundColor: '#e3f2fd',
          border: '1px solid #bbdefb',
          color: '#1976d2',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <h3>🔧 백엔드 서버 체크리스트</h3>
          <ul style={{ marginLeft: '20px' }}>
            <li>Spring Boot 서버가 <code>localhost:8080</code>에서 실행 중인가요?</li>
            <li>H2 데이터베이스 연결이 성공했나요?</li>
            <li>Spring Security에서 <code>/api/products</code>를 permitAll() 했나요?</li>
            <li>CORS 설정에서 <code>http://localhost:3000</code>을 허용했나요?</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* 상품 목록 헤더와 등록 버튼 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '8px'
            }}>
              🛍️ 실시간 상품 목록
            </h2>
            <span style={{ color: '#666', fontSize: '16px' }}>
              {products.length > 0
                ? `데이터베이스에서 가져온 상품: ${products.length}개`
                : "아직 등록된 상품이 없습니다"
              }
            </span>
          </div>

          {/* 로그인한 경우에만 상품 등록 버튼 표시 */}
          {isAuthenticated() && (
            <button
              onClick={handleProductCreate}
              style={{
                padding: '15px 30px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              ➕ 상품 등록하기
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '16px',
            border: '2px dashed #dee2e6'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
            <h3 style={{ marginBottom: '12px', color: '#333', fontSize: '24px' }}>
              데이터베이스가 비어있습니다
            </h3>
            <p style={{ color: '#666', marginBottom: '24px', fontSize: '16px' }}>
              {isAuthenticated() 
                ? "아직 등록된 상품이 없습니다. 첫 번째 상품을 등록해보세요!"
                : "아직 등록된 상품이 없습니다. 로그인 후 상품을 등록할 수 있습니다."
              }
            </p>
            {isAuthenticated() && (
              <button
                onClick={handleProductCreate}
                style={{
                  padding: '15px 30px',
                  backgroundColor: '#FF6B35',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                지금 상품 등록하기 →
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;