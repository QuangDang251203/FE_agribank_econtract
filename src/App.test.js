import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login screen', () => {
  window.history.pushState({}, '', '/login');
  render(<App />);

  expect(screen.getByText(/ngân hàng nông nghiệp/i)).toBeInTheDocument();
  expect(screen.getByText(/chao mung|chào mừng/i)).toBeInTheDocument();
  expect(screen.getByText(/internet banking - khách hàng tổ chức/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/mã tổ chức/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/tên đăng nhập/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/mã ngẫu nhiên/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /dang nhap|đăng nhập/i })).toBeInTheDocument();
  expect(screen.getByText(/điểm atm và/i)).toBeInTheDocument();
});

test('renders layout screen on layout route', () => {
  window.history.pushState({}, '', '/layout');
  render(<App />);

  expect(screen.getByText(/hệ thống ngân hàng số/i)).toBeInTheDocument();
  expect(screen.getByText(/danh sách khoản vay/i)).toBeInTheDocument();
  expect(screen.getByText(/khởi tạo khoản vay/i)).toBeInTheDocument();
});

