import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert('로그아웃되었습니다.');
    navigate('/');
  };

  return (
    <header style={{
      background: '#FF6B35',
      color: 'white',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div>
        <h1
          style={{ margin: 0, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          🛍️ 중고마켓
        </h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
          React + Spring Boot
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {isAuthenticated() ? (
          <>
            <span style={{ fontSize: '16px' }}>
              안녕하세요, {user?.username}님!
            </span>
            <button
              onClick={() => navigate('/mypage')}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '8px 16px',
                borderRadius: '6px'
              }}
            >
              마이페이지
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              로그인
            </button>
            <button
              onClick={() => navigate('/signup')}
              style={{
                padding: '8px 16px',
                backgroundColor: 'white',
                color: '#FF6B35',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;