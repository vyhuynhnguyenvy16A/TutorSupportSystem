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




## 🌊 Workflow chi tiết cho từng người

### Tuần 7 - 8

### 1. Người 1 (Backend - Auth & DB)
**Mục tiêu:** Tạo CSDL và API để đăng nhập/đăng ký.

**Flow:**

1. Định nghĩa schema.prisma (Models: User, Product, Role).  
2. Chạy `npx prisma migrate dev` để tạo CSDL trên PostgreSQL.  
3. Code API `POST /api/auth/register` (hash mật khẩu bằng bcrypt).  
4. Code API `POST /api/auth/login` (tạo JWT có chứa role).  
**Output:** Cung cấp 2 API endpoints này cho Người 3.



### 2. Người 2 (Backend - Core APIs & Phân quyền)
**Mục tiêu:** Tạo API nghiệp vụ (sản phẩm) và bảo vệ chúng.

**Flow:**

1. Code các Middleware `isAuth` (kiểm tra JWT) và `isRole` (kiểm tra role).  
2. Code API CRUD cho Product (ví dụ: `GET /api/products`).  
3. Áp dụng Middleware vào các route cần bảo vệ (ví dụ: `POST /api/products` phải yêu cầu `isAuth` và `isRole(['SHOP'])`).  
**Output:** Cung cấp API `GET /api/products` cho Người 5.



### 3. Người 3 (Frontend - Auth UI & Logic)
**Mục tiêu:** Làm UI/UX cho login và quản lý state đăng nhập.
    
**Phụ thuộc:** Chờ API từ Người 1.

**Flow:**

1. Dựng giao diện (UI) cho trang `/login` và `/register` (dùng react-hook-form).  
2. Tạo `AuthContext` với các hàm `login()`, `logout()` và state `isLoggedIn`, `user`.  
3. Kết nối UI với AuthContext: Khi nhấn nút "Login", gọi hàm `login()`.  
4. Trong hàm `login()`, gọi `axios.post` đến API (từ Người 1).  
**Output:** Khi login thành công, lưu token vào `localStorage` và cập nhật state trong `AuthContext`.



### 4. Người 4 (Frontend - Routing & Phân luồng)
**Mục tiêu:** Điều hướng người dùng dựa trên trạng thái đăng nhập và vai trò.

**Phụ thuộc:** AuthContext từ Người 3.

**Flow:**

1. Tạo các trang "Placeholder" cho `/admin/dashboard` và `/shop/dashboard`.  
2. Tạo component `ProtectedRoute`: Đọc `isLoggedIn` từ AuthContext. Nếu false, điều hướng về `/login`.  
3. Tạo logic `RoleRedirect`: Đọc `user.role` từ AuthContext. Tự động điều hướng user đến trang phù hợp (`/`, `/admin`, `/shop`).  
**Output:** Cấu hình file `App.jsx` để ráp nối tất cả các luồng (public, protected, role-based).



### 5. Người 5 (Frontend - Homepage UI & Data)
**Mục tiêu:** Xây dựng trang chủ và hiển thị sản phẩm.

**Phụ thuộc:** Chờ API `GET /api/products` từ Người 2.

**Flow:**

1. Dựng các component UI chung: Header, Footer, ProductCard.  
2. Cài đặt và cấu hình React Query (TanStack Query).  
3. Trong trang `HomePage.jsx`, dùng `useQuery` để gọi API (từ Người 2).  
4. Hiển thị UI (loading, error, hoặc danh sách sản phẩm).  
**Output:** Hoàn thiện trang chủ cho vai trò USER.

&&-------------------------------------------------------------------------&&
## Tuần 9

**Mục tiêu:** Hoàn thành luồng cơ bản cho người dùng: xem danh sách sản phẩm (có lọc/tìm kiếm), xem chi tiết sản phẩm (có đánh giá), thêm/xem/sửa giỏ hàng.

---

## Backend (BE)

### BE1: Giỏ hàng & Schema Chính
* **Công việc:**
    1.  Hoàn thiện `schema.prisma` (Thêm `Cart`, `CartItem`, `Category`, `Review`). Chạy migrate.
    2.  Tạo **API CRUD cho Giỏ hàng** (`GET /cart`, `POST /cart/items`, `PUT /cart/items/:itemId`, `DELETE /cart/items/:itemId`) - Yêu cầu `isAuth`.
    3.  Tạo API `GET /api/categories`.
    4.  Seed data cho `Category`.

### BE2: Sản phẩm, Đánh giá & Tìm kiếm/Lọc
* **Công việc:**
    1.  Hoàn thiện **API Chi tiết Sản phẩm** (`GET /api/products/:id`)
    2.  Cập nhật **API Lấy danh sách Sản phẩm** (`GET /api/products`) - Hỗ trợ lọc theo `category` và `search`.
    3.  Tạo **API Gửi Đánh giá** (`POST /api/products/:id/reviews`) - Yêu cầu `isAuth`.
    4.  Seed data cho `Review`.

---

## Frontend (FE)

### FE1: Trang Chi tiết Sản phẩm & Đánh giá
* **Công việc:**
    1.  Xây dựng **Trang Chi tiết Sản phẩm** (`/products/:id`) - Giao diện & Gọi API chi tiết.
    2.  Thêm tính năng **"Thêm vào giỏ"** trong chi tiết sản phẩm - Gọi API giỏ hàng.
    2.  Hiển thị danh sách **Đánh giá** trên trang chi tiết.
    3.  Tạo Form **Gửi Đánh giá** (chỉ hiển thị khi đã login) - Gọi API gửi đánh giá.

### FE2: Trang Giỏ hàng & Header
* **Công việc:**
    1.  Xây dựng **Trang Giỏ hàng** (`/cart`) - Giao diện & Gọi API (xem, sửa số lượng, xóa, chọn hàng cần thanh toán).
    2.  Hiển thị **Tổng tiền thanh toán** giỏ hàng.
    3.  Cập nhật **Header** - Hiển thị giỏ hàng trong phần Menu (chỉ khi đã login).

### FE3: ProductPage (Lọc, Search) & Nút "Thêm vào giỏ"
* **Công việc:**
    1.  Xây dựng trang danh sách sản phẩm **ProductPage**:
        * Thêm component **Lọc theo Category** (gọi API lấy categories).
        * Kết nối chức năng Lọc & Search Bar với API `GET /products` đã cập nhật.
    2.  Tích hợp nút **"Thêm vào giỏ"** trên `ProductCard` (ProductPage) - Gọi API giỏ hàng.

&&-------------------------------------------------------------------------&&


## 🛠️ Cách chạy dự án (Development)

Mỗi thành viên cần chạy cả 2 server (backend và frontend) song song.



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
