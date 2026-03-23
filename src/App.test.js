import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders login screen', () => {
  window.history.pushState({}, '', '/login');
  render(<App />);

  expect(screen.getByAltText(/agribank corporate ebanking/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /đăng nhập/i })).toBeInTheDocument();
  expect(screen.getByText(/internet banking - khách hàng doanh nghiệp/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/mã doanh nghiệp/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/tên đăng nhập/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^mã xác thực/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /dang nhap|đăng nhập/i })).toBeInTheDocument();
});

test('submitting login form routes to layout screen', () => {
  window.history.pushState({}, '', '/login');
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /dang nhap|đăng nhập/i }));

  expect(screen.getByText(/hệ thống khách hàng doanh nghiệp/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /trang chủ/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /trang chủ/i })).toHaveAttribute('aria-current', 'page');
});

test('renders layout screen on layout route', () => {
  window.history.pushState({}, '', '/layout');
  render(<App />);

  expect(screen.getByText(/hệ thống khách hàng doanh nghiệp/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /trang chủ/i })).toBeInTheDocument();
  expect(screen.getByText(/thông tin tài khoản/i)).toBeInTheDocument();
});

test('clicking sidebar item switches main content page', () => {
  window.history.pushState({}, '', '/layout');
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /thông tin tài khoản/i }));

  expect(screen.getByRole('heading', { name: /thông tin tài khoản/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /thông tin tài khoản/i })).toHaveAttribute('aria-current', 'page');
});

test('clicking loan create submenu renders the secured loan creation page', () => {
  window.history.pushState({}, '', '/layout');
  render(<App />);

  fireEvent.click(screen.getByRole('menuitem', { name: /tạo khoản vay mới/i }));

  expect(screen.getByRole('heading', { name: /vay có thế chấp tiền gửi/i })).toBeInTheDocument();
  expect(screen.getByText(/tài sản đảm bảo/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/giá trị khoản vay/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /xác nhận/i })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: /tạo khoản vay mới/i })).toHaveAttribute('aria-current', 'page');
});

test('clicking confirm on secured loan page opens and closes the confirmation popup', () => {
  window.history.pushState({}, '', '/layout');
  render(<App />);

  fireEvent.click(screen.getByRole('menuitem', { name: /tạo khoản vay mới/i }));
  fireEvent.click(screen.getByRole('button', { name: /xác nhận/i }));

  expect(screen.getByRole('dialog', { name: /xác nhận thông tin/i })).toBeInTheDocument();
  expect(screen.getByText(/ký số/i)).toBeInTheDocument();
  expect(screen.getByText(/chín trăm triệu việt nam đồng chẵn/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /đóng popup xác nhận/i }));
  expect(screen.queryByRole('dialog', { name: /xác nhận thông tin/i })).not.toBeInTheDocument();
});

test('clicking loan history submenu keeps the generic secured loan page', () => {
  window.history.pushState({}, '', '/layout');
  render(<App />);

  fireEvent.click(screen.getByRole('menuitem', { name: /lịch sử khoản vay/i }));

  expect(screen.getByRole('heading', { name: /vay có thế chấp tiền gửi/i })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: /lịch sử khoản vay/i })).toHaveAttribute('aria-current', 'page');
});

