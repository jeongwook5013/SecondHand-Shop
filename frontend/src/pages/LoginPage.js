import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Header from '../components/common/Header';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 입력 시 에러 메시지 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!credentials.username || !credentials.password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('로그인 시도:', credentials.username);
      
      const response = await authAPI.login(credentials);
      
      console.log('로그인 응답:', response);

      // JWT 토큰과 사용자 정보 저장
      if (response.token) {
        const userData = {
          username: response.username || credentials.username
        };
        
        login(userData, response.token);
        
        console.log('토큰 저장 완료:', response.token);
        
        alert(`환영합니다, ${userData.username}님!`);
        navigate('/');
      } else {
        setError('로그인 응답에 토큰이 없습니다.');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          padding: '50px',
          width: '100%',
          maxWidth: '450px'
        }}>
          {/* 헤더 */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              🛍️
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '8px'
            }}>
              로그인
            </h1>
            <p style={{
              color: '#666',
              fontSize: '14px'
            }}>
              중고거래 플랫폼에 오신 것을 환영합니다
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div style={{
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#c33',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit}>
            {/* 아이디 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                아이디
              </label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="아이디를 입력하세요"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            {/* 비밀번호 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="비밀번호를 입력하세요"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: loading ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                marginBottom: '16px'
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#007bff')}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>

            {/* 회원가입 링크 */}
            <div style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#666'
            }}>
              계정이 없으신가요?{' '}
              <Link
                to="/signup"
                style={{
                  color: '#007bff',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                회원가입
              </Link>
            </div>
          </form>

          {/* 테스트 계정 안내 */}
          <div style={{
            marginTop: '30px',
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              💡 테스트 계정
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666',
              lineHeight: '1.6'
            }}>
              아이디: <strong>testuser1</strong><br />
              비밀번호: <strong>test123!</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
