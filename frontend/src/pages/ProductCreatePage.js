import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import api from '../services/api';

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();

  const [categories, setCategories] = useState([
    { id: 1, name: '전자제품' },
    { id: 2, name: '패션/의류' },
    { id: 3, name: '도서/음반' },
    { id: 4, name: '가구/인테리어' },
    { id: 5, name: '스포츠/레저' },
    { id: 6, name: '기타' }
  ]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    categoryId: '',
    image: null
  });

  // 로그인 체크
  useEffect(() => {
    if (!isAuthenticated()) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 체크 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        return;
      }

      // 이미지 파일인지 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.title || !formData.description || !formData.price ||
        !formData.location || !formData.categoryId) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      console.log('토큰 확인:', token);

      // FormData 객체 생성 (파일 업로드를 위해)
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('location', formData.location);
      submitData.append('categoryId', formData.categoryId);

      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await api.post('/api/products', submitData);

      console.log('서버 응답:', response);

      // 응답이 성공이면 (response.status === 'success' 또는 응답 자체가 성공)
      if (response.status === 'success' || response.message) {
        alert('상품이 성공적으로 등록되었습니다!');
        navigate('/');
      }
    } catch (error) {
      console.error('상품 등록 실패:', error);
      alert('상품 등록 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?')) {
      navigate('/');
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: null }));
  };

  return (
    <div>
      <Header />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          padding: '40px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            🛍️ 상품 등록
          </h1>

          <form onSubmit={handleSubmit}>
            {/* 제목 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                상품명 *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="예: 아이폰 14 Pro 128GB"
                maxLength="100"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
            </div>

            {/* 카테고리 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                카테고리 *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">카테고리를 선택하세요</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 가격 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                가격 *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingRight: '50px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                  fontSize: '16px'
                }}>
                  원
                </span>
              </div>
            </div>

            {/* 거래 지역 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                거래 지역 *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="예: 서울 강남구"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 상품 설명 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                상품 설명 *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                placeholder="상품에 대한 자세한 설명을 입력해주세요..."
                maxLength="1000"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '120px',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{
                fontSize: '14px',
                color: '#666',
                textAlign: 'right',
                marginTop: '4px'
              }}>
                {formData.description.length}/1000자
              </div>
            </div>

            {/* 이미지 업로드 */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                상품 이미지
              </label>

              {imagePreview ? (
                <div style={{ marginBottom: '16px' }}>
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid #e9ecef'
                    }}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={removeImage}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      이미지 제거
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  border: '2px dashed #dee2e6',
                  borderRadius: '8px',
                  padding: '40px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.borderColor = '#adb5bd'}
                onMouseOut={(e) => e.target.style.borderColor = '#dee2e6'}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
                  <label
                    htmlFor="image"
                    style={{
                      cursor: 'pointer',
                      color: '#007bff',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    이미지 업로드
                  </label>
                  <p style={{ color: '#666', fontSize: '14px', margin: '8px 0 0 0' }}>
                    PNG, JPG, GIF 최대 10MB
                  </p>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: '2px solid #dee2e6',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#666',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: loading ? '#6c757d' : '#28a745',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '등록 중...' : '상품 등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductCreatePage;
