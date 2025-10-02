import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import api from '../services/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error('상품 조회 실패:', err);
        setError('상품을 찾을 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await api.delete(`/api/products/${id}`);
      alert('상품이 삭제되었습니다.');
      navigate('/');
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('상품 삭제에 실패했습니다.');
    }
  };

  const handleContact = () => {
    alert('채팅 기능은 추후 구현 예정입니다.');
  };

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

  if (error) {
    return (
      <div>
        <Header />
        <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2>😥 상품을 찾을 수 없습니다</h2>
          <p style={{ color: '#666', margin: '20px 0' }}>{error}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#FF6B35',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isOwner = isAuthenticated() && user?.username === product.sellerUsername;

  return (
    <div>
      <Header />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '30px',
            fontSize: '14px'
          }}
        >
          ← 목록으로 돌아가기
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
          {/* 이미지 영역 */}
          <div>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                style={{
                  width: '100%',
                  maxHeight: '500px',
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                fontSize: '80px',
                color: '#dee2e6'
              }}>
                📷
              </div>
            )}
          </div>

          {/* 상품 정보 영역 */}
          <div>
            <div style={{ marginBottom: '30px' }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                margin: '0 0 16px 0',
                color: '#333'
              }}>
                {product.title}
              </h1>

              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#FF6B35',
                marginBottom: '20px'
              }}>
                {new Intl.NumberFormat('ko-KR').format(product.price)}원
              </div>

              {product.isSold && (
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '20px'
                }}>
                  판매완료
                </div>
              )}
            </div>

            {/* 상품 정보 테이블 */}
            <div style={{
              border: '1px solid #e9ecef',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '30px'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{
                      padding: '16px',
                      backgroundColor: '#f8f9fa',
                      fontWeight: 'bold',
                      borderBottom: '1px solid #e9ecef',
                      width: '120px'
                    }}>
                      카테고리
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                      {product.categoryName}
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      padding: '16px',
                      backgroundColor: '#f8f9fa',
                      fontWeight: 'bold',
                      borderBottom: '1px solid #e9ecef'
                    }}>
                      거래지역
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                      📍 {product.location}
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      padding: '16px',
                      backgroundColor: '#f8f9fa',
                      fontWeight: 'bold',
                      borderBottom: '1px solid #e9ecef'
                    }}>
                      판매자
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                      👤 {product.sellerUsername}
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      padding: '16px',
                      backgroundColor: '#f8f9fa',
                      fontWeight: 'bold'
                    }}>
                      등록일
                    </td>
                    <td style={{ padding: '16px' }}>
                      🕒 {new Date(product.createdAt).toLocaleString('ko-KR')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 버튼 영역 */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
              {isOwner ? (
                <>
                  <button
                    onClick={handleEdit}
                    style={{
                      flex: 1,
                      padding: '16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    수정하기
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{
                      flex: 1,
                      padding: '16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    삭제하기
                  </button>
                </>
              ) : (
                <button
                  onClick={handleContact}
                  disabled={product.isSold}
                  style={{
                    flex: 1,
                    padding: '16px',
                    backgroundColor: product.isSold ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: product.isSold ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {product.isSold ? '판매완료된 상품입니다' : '💬 판매자와 채팅하기'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 상품 설명 */}
        <div style={{
          marginTop: '50px',
          padding: '30px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
            상품 설명
          </h3>
          <div style={{
            lineHeight: '1.8',
            fontSize: '16px',
            color: '#333',
            whiteSpace: 'pre-wrap'
          }}>
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
