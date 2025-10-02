import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import ProductCard from '../components/product/ProductCard';
import api from '../services/api';

const MyPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('selling'); // selling, sold

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/');
      return;
    }

    fetchMyProducts();
  }, [isAuthenticated, navigate]);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      // 모든 상품을 가져와서 내가 등록한 상품만 필터링
      const response = await api.get('/api/products');
      console.log('API 응답:', response);

      // 응답 데이터가 배열인지 확인
      let allProducts = [];
      if (response && Array.isArray(response)) {
        allProducts = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        allProducts = response.data;
      } else {
        console.error('예상하지 못한 응답 구조:', response);
        allProducts = [];
      }

      const myProductsList = allProducts.filter(product =>
        product.sellerUsername === user?.username
      );
      setMyProducts(myProductsList);
    } catch (error) {
      console.error('내 상품 목록 조회 실패:', error);
      alert('상품 목록을 불러오는데 실패했습니다.');
      setMyProducts([]); // 오류 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  };

  const sellingProducts = myProducts.filter(product => !product.isSold);
  const soldProducts = myProducts.filter(product => product.isSold);

  if (loading) {
    return (
      <div>
        <Header />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #FF6B35',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* 사용자 정보 섹션 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          padding: '40px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#FF6B35',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: 'white',
              marginRight: '20px'
            }}>
              👤
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {user?.username}님의 마이페이지
              </h2>
              <p style={{ color: '#666', margin: 0 }}>
                등록한 상품: {myProducts.length}개 | 판매중: {sellingProducts.length}개 | 판매완료: {soldProducts.length}개
              </p>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ borderBottom: '2px solid #f1f3f4' }}>
            <button
              onClick={() => setActiveTab('selling')}
              style={{
                padding: '16px 24px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'selling' ? '2px solid #FF6B35' : '2px solid transparent',
                color: activeTab === 'selling' ? '#FF6B35' : '#666',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginRight: '20px'
              }}
            >
              판매중 ({sellingProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('sold')}
              style={{
                padding: '16px 24px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'sold' ? '2px solid #FF6B35' : '2px solid transparent',
                color: activeTab === 'sold' ? '#FF6B35' : '#666',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              판매완료 ({soldProducts.length})
            </button>
          </div>
        </div>

        {/* 상품 목록 */}
        <div>
          {activeTab === 'selling' && (
            <div>
              {sellingProducts.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '16px',
                  border: '2px dashed #dee2e6'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
                  <h3 style={{ marginBottom: '12px', color: '#333', fontSize: '24px' }}>
                    판매중인 상품이 없습니다
                  </h3>
                  <p style={{ color: '#666', marginBottom: '24px', fontSize: '16px' }}>
                    첫 번째 상품을 등록해보세요!
                  </p>
                  <button
                    onClick={() => navigate('/')}
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
                    홈으로 가서 상품 등록하기 →
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '24px'
                }}>
                  {sellingProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sold' && (
            <div>
              {soldProducts.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '16px',
                  border: '2px dashed #dee2e6'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
                  <h3 style={{ marginBottom: '12px', color: '#333', fontSize: '24px' }}>
                    판매완료된 상품이 없습니다
                  </h3>
                  <p style={{ color: '#666', fontSize: '16px' }}>
                    판매가 완료된 상품들이 여기에 표시됩니다.
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '24px'
                }}>
                  {soldProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
