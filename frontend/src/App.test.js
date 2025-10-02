import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// API 모듈을 목(mock)으로 대체
jest.mock('./services/api', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] }))
}));

test('renders app with router and shows loading state initially', async () => {
  render(<App />);

  // 로딩 상태가 먼저 나타나는지 확인
  expect(screen.getByText(/백엔드 API에서 데이터를 불러오는 중/i)).toBeInTheDocument();

  // API 호출 완료 후 상품 목록 페이지가 표시되는지 확인
  await waitFor(() => {
    expect(screen.getByText(/실시간 상품 목록/i)).toBeInTheDocument();
  });
});
