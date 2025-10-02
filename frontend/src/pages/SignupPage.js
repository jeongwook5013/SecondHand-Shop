import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Header from '../components/common/Header';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 해당 필드의 에러 메시지 초기화
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // 아이디 검증
    if (!formData.username) {
      newErrors.username = '아이디를 입력해주세요.';
    } else if (formData.username.length < 4) {
      newErrors.username = '아이디는 4자 이상이어야 합니다.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    // 비밀번호 확인
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('회원가입 시도:', formData.username);
      
      const signupData = {
        username: formData.username,
        password: formData.password,
        email: formData.email
      };
      
      const response = await authAPI.signup(signupData);
      
      console.log('회원가입 응답:', response);

      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      
      // 서버 에러 메시지 파싱
      const errorMessage = error.message;
      
      if (errorMessage.includes('username')) {
        setErrors(prev => ({ ...prev, username: '이미 사용중인 아이디입니다.' }));
      } else if (errorMessage.includes('email')) {
        setErrors(prev => ({ ...prev, email: '이미 사용중인 이메일입니다.' }));
      } else {
        setErrors(prev => ({ ...prev, general: '회원가입 중 오류가 발생했습니다.' }));
      }
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
              회원가입
            </h1>
            <p style={{
              color: '#666',
              fontSize: '14px'
            }}>
              중고거래를 시작하세요
            </p>
          </div>

          {/* 일반 에러 메시지 */}
          {errors.general && (
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
              <span>{errors.general}</span>
            </div>
          )}

          {/* 회원가입 폼 */}
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
                아이디 *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="4자 이상 입력하세요"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${errors.username ? '#dc3545' : '#e0e0e0'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => !errors.username && (e.target.style.borderColor = '#007bff')}
                onBlur={(e) => !errors.username && (e.target.style.borderColor = '#e0e0e0')}
              />
              {errors.username && (
                <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '6px' }}>
                  {errors.username}
                </div>
              )}
            </div>

            {/* 이메일 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                이메일 *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${errors.email ? '#dc3545' : '#e0e0e0'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => !errors.email && (e.target.style.borderColor = '#007bff')}
                onBlur={(e) => !errors.email && (e.target.style.borderColor = '#e0e0e0')}
              />
              {errors.email && (
                <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '6px' }}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* 비밀번호 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                비밀번호 *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="6자 이상 입력하세요"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${errors.password ? '#dc3545' : '#e0e0e0'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => !errors.password && (e.target.style.borderColor = '#007bff')}
                onBlur={(e) => !errors.password && (e.target.style.borderColor = '#e0e0e0')}
              />
              {errors.password && (
                <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '6px' }}>
                  {errors.password}
                </div>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                비밀번호 확인 *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="비밀번호를 다시 입력하세요"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${errors.confirmPassword ? '#dc3545' : '#e0e0e0'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => !errors.confirmPassword && (e.target.style.borderColor = '#007bff')}
                onBlur={(e) => !errors.confirmPassword && (e.target.style.borderColor = '#e0e0e0')}
              />
              {errors.confirmPassword && (
                <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '6px' }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: loading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                marginBottom: '16px'
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#218838')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#28a745')}
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>

            {/* 로그인 링크 */}
            <div style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#666'
            }}>
              이미 계정이 있으신가요?{' '}
              <Link
                to="/login"
                style={{
                  color: '#007bff',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                로그인
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
