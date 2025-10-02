const API_BASE_URL = 'http://localhost:8080';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // localStorage에서 JWT 토큰 가져오기
  const token = localStorage.getItem('token');

  // 기본 헤더 설정
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  console.log('API 요청:', url, 'Token:', token ? '있음' : '없음');

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.text();
    console.error('API 에러:', response.status, errorData);
    throw new Error(`HTTP ${response.status}: ${errorData}`);
  }

  return response.json();
};

export const productAPI = {
  getAll: () => apiRequest('/api/products'),
  getById: (id) => apiRequest(`/api/products/${id}`),
  create: (productData) => apiRequest('/api/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),
  update: (id, productData) => apiRequest(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  }),
  delete: (id) => apiRequest(`/api/products/${id}`, {
    method: 'DELETE'
  })
};

export const authAPI = {
  signup: (userData) => apiRequest('/api/users/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  login: (credentials) => apiRequest('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
};

export const userAPI = {
  getProfile: (token) => apiRequest('/api/users/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }),
  updateProfile: (userData, token) => apiRequest('/api/users/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  })
};

// 기본 API 객체 (하위 호환성을 위해)
const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data, options = {}) => {
    const isFormData = data instanceof FormData;

    return apiRequest(endpoint, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      ...options
    });
  },
  put: (endpoint, data, options = {}) => {
    const isFormData = data instanceof FormData;

    return apiRequest(endpoint, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      ...options
    });
  },
  delete: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      method: 'DELETE',
      ...options
    });
  }
};

export default api;