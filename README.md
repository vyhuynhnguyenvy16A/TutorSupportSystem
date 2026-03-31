🎓 Tutor Support System
A robust booking and consultation platform built with the PERN Stack (PostgreSQL, Express, React, Node.js), implementing a clean MVC architecture to manage interactions between Students, Tutors, and Administrators.

Overview
Dự án này giải quyết bài toán đặt lịch và quản lý buổi tư vấn giữa sinh viên và giảng viên. Thay vì quản lý thủ công, hệ thống tự động hóa luồng công việc từ lúc đặt lịch, phê duyệt cho đến khi kết thúc buổi họp, đảm bảo tính minh bạch và hiệu quả cao.

Hệ thống được thiết kế theo mô hình Client-Server tách biệt, giúp dễ dàng mở rộng và bảo trì.
Architecture
Tutor-Support-System (Monorepo)
├── Tutor-Support-System-Backend (Server/Controller/Model)
│ ├── prisma/ # Database Schema & Migrations
│ ├── src/controllers/ # Logic xử lý Request
│ ├── src/routers/ # Cấu trúc điều hướng (via Prisma)
│ └── .env # Cấu hình Database & JWT Secret
│
└── CNPM_frontend (Client/View)
├── src/api/ # Axios services
├── src/context/ # Auth & Global state
├── src/pages/ # UI Components & Routing
└── vite.config.js # Build tool configuration

Features
Role-Based Access Control (RBAC)

Student - Create/View "Đặt lịch, tìm kiếm Tutor, xem lịch sử tư vấn."
Tutor - Manage/Update "Duyệt lịch hẹn, quản lý thời gian biểu cá nhân."
Admin - Full Control "Quản lý người dùng, thống kê hệ thống, kiểm soát tài nguyên."
Technical Capabilities
Authentication — Bảo mật bằng JSON Web Token (JWT) và phân quyền Middleware.

Database Management — Sử dụng Prisma ORM để pull và generate schema tự động từ PostgreSQL.

State Management — Kết hợp React Context cho dữ liệu người dùng và TanStack Query cho Server State.

UI/UX — Giao diện phản hồi nhanh (Responsive) với các thư viện hiện đại.

Getting Started
Hệ thống yêu cầu cài đặt Node.js (v18+) và một instance PostgreSQL đang hoạt động.

cd Tutor-Support-System-Backend

# Cài đặt dependencies

npm install

# Cấu hình file .env (DATABASE_URL="postgresql://...")

# Đồng bộ Database

npm run db:pull
npm run db:generate

# Chạy server development

npm run dev

cd CNPM_frontend

# Cài đặt dependencies

npm install

# Chạy giao diện

npm run dev

Key Design Decisions
Tại sao chọn PERN Stack?
Sự kết hợp giữa tính chặt chẽ của PostgreSQL và tính linh hoạt của JavaScript (Node.js/React) giúp tối ưu hóa tốc độ phát triển nhưng vẫn đảm bảo dữ liệu quan hệ được toàn vẹn.

Vai trò của Prisma ORM?
Thay vì viết SQL thuần, Prisma giúp quản lý Type-safety tuyệt đối cho dữ liệu, giảm thiểu lỗi runtime khi làm việc với các bảng phức tạp như Appointment hay UserRoles.

Cấu trúc thư mục MVC?
Phần Frontend đóng vai trò là View, Backend đóng vai trò Controller và Model. Việc chia nhỏ giúp đội ngũ phát triển có thể làm việc song song mà không gây xung đột code.

👤 Author
Huynh Nguyen Vy — Year 3, Computer Science, HCMUT
