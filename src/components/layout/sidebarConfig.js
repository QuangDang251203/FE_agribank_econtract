export const DEFAULT_SIDEBAR_KEY = 'home';

export const sidebarItems = [
  { key: 'home', label: 'Trang chủ', icon: 'home' },
  {
    key: 'account',
    label: 'Thông tin tài khoản',
    icon: 'account',
    children: [
      { key: 'account-payment', label: 'Tài khoản thanh toán' },
      { key: 'account-deposit', label: 'Tiền gửi có kỳ hạn' },
    ],
  },
  {
    key: 'transaction',
    label: 'Thông tin giao dịch',
    icon: 'transaction',
    children: [
      { key: 'transaction-lookup', label: 'Tra cứu giao dịch' },
      { key: 'transaction-statement', label: 'Sao kê điện tử' },
    ],
  },
  {
    key: 'transfer-single',
    label: 'Chuyển khoản đơn',
    icon: 'transfer-single',
    children: [
      { key: 'transfer-single-internal', label: 'Trong hệ thống' },
      { key: 'transfer-single-external', label: 'Ngoài hệ thống' },
    ],
  },
  {
    key: 'transfer-bulk',
    label: 'Chuyển khoản lô',
    icon: 'transfer-bulk',
    children: [
      { key: 'transfer-bulk-create', label: 'Tạo lệnh chuyển khoản lô' },
      { key: 'transfer-bulk-list', label: 'Danh sách lệnh đã tạo' },
    ],
  },
  {
    key: 'loan',
    label: 'Vay có thế chấp tiền gửi',
    icon: 'loan',
    children: [
      { key: 'loan-create', label: 'Tạo khoản vay mới' },
      { key: 'loan-history', label: 'Lịch sử khoản vay' },
      { key: 'admin-contracts', label: 'Danh sách hợp đồng (Admin)' },
    ],
  },
  {
    key: 'bill',
    label: 'Thanh toán hóa đơn',
    icon: 'bill',
    children: [
      { key: 'bill-electricity', label: 'Điện' },
      { key: 'bill-water', label: 'Nước' },
      { key: 'bill-telecom', label: 'Viễn thông' },
    ],
  },
  {
    key: 'tax',
    label: 'Nộp thuế điện tử',
    icon: 'tax',
    children: [
      { key: 'tax-create', label: 'Lập giấy nộp tiền' },
      { key: 'tax-history', label: 'Lịch sử nộp thuế' },
    ],
  },
  {
    key: 'online',
    label: 'Tài khoản trực tuyến',
    icon: 'online',
    children: [
      { key: 'online-open', label: 'Mở tài khoản mới' },
      { key: 'online-manage', label: 'Quản lý tài khoản' },
    ],
  },
];

