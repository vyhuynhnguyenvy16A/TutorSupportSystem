# Dự án Web Bán Hàng (PERN Stack)

Đây là dự án nội bộ nhằm xây dựng một website đặt lịch họp tư vấn giữa sinh viên và giảng viên/cố vấn (tutor). Project được xây dựng trên nền tảng PERN Stack (PostgreSQL, Express, React, Node.js) và được tổ chức theo mô hình MVC.

Hệ thống được thiết kế để phân chia chức năng cho 3 vai trò (role) chính: Student (Sinh viên), Tutor (Cố vấn/Giảng viên), và Admin (Quản trị viên).

## 🚀 Công nghệ sử dụng


* **Frontend:** React (với Vite)
* **ORM:** Prisma (Kết nối và quản lý CSDL)
* **Xác thực:** JWT (JSON Web Tokens)
* **UI (Gợi ý):** MUI hoặc Ant Design
* **Gọi API:** Axios
* **Quản lý State (Data):** React Context (cho Auth) & TanStack/React Query (cho server data)

---

## 📂 Cấu trúc Thư mục

### `/frontend` (Client/View)
Phần frontend (React) đóng vai trò là View (V) trong MVC.

/frontend
├── /src
│   ├── /api        (Các file service để gọi API: authService.js...)
│   ├── /components (Các component UI nhỏ, tái sử dụng: ProductCard, Header...)
│   ├── /context    (AuthContext - Nơi quản lý state đăng nhập toàn cục)
│   ├── /hooks      (Các custom hook)
│   ├── /pages      (Các trang hoàn chỉnh: LoginPage, HomePage, AdminDashboard...)
│   ├── /routes     (Logic điều hướng: ProtectedRoute, RoleRedirect...)
├── App.jsx         (Component App chính, chứa logic router)
├── main.jsx        (File khởi chạy React)
└── package.json







### Chạy Frontend

```bash
# 1. Mở 1 terminal MỚI, đi vào thư mục frontend
cd frontend

# 2. Cài đặt các gói
npm install

# 3. Khởi động server React (Vite)
npm run dev

# 4. Mở trình duyệt và truy cập http://localhost:5173 (hoặc cổng tương tự)
```
"# CNPM_frontend" 
"# CNPM_frontend" 
"# CNPM_frontend" 
