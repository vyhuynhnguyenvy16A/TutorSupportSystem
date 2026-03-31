Các API này được tổ chức theo vai trò người dùng (Public, Student, Tutor, Admin) và chức năng.

---

### 🔑 Xác thực (Authentication)

Đây là các API cơ bản để quản lý việc đăng nhập và đăng ký của người dùng.

* **`POST /auth/register`** (Giao diện đăng ký) ✅
    * **Mô tả:** Tạo tài khoản người dùng mới (dựa trên Giao diện đăng ký.jpg, có vẻ ban đầu là cho sinh viên).
    * **Request Body:** `{ fullName, email, password, password_confirmation }`
    * **Response:** `{ user, token }`
* **`POST /auth/login`** (Giao diện đăng nhập) ✅
    * **Mô tả:** Đăng nhập bằng email và mật khẩu.
    * **Request Body:** `{ email, password }`
    * **Response:** `{ user, token }` (Token này sẽ được lưu ở frontend để xác thực các request sau).
* **`POST /auth/logout`** ✅
    * **Mô tả:** Đăng xuất người dùng (thường là vô hiệu hóa token).

---

### 🧑‍🎓 Sinh viên (Student)

Các API này yêu cầu token xác thực của sinh viên.

#### 1. Hồ sơ & Cài đặt (Giao diện cài đặt hồ sơ (Student))

* **`GET /student/profile`** ✅ (Cần làm)
    * **Mô tả:** Lấy thông tin cá nhân của sinh viên đang đăng nhập (để hiển thị trong tab "Hồ sơ").
    * **Response:** `{ mssv, hoTen, ngaySinh, gioiTinh, soCMND, soDienThoai, email }`
* **`PUT /student/profile`** ✅ (Cần làm)
    * **Mô tả:** Cập nhật thông tin cá nhân của sinh viên.
    * **Request Body:** `{ hoTen, ngaySinh, gioiTinh, soCMND, soDienThoai }`

#### 2. Lịch & Đăng ký (Giao diện lịch & Giao diện đăng ký lịch (Student))

* **`GET /student/calendar`** (Giao diện lịch)
    * **Mô tả:** Lấy dữ liệu các sự kiện/buổi học trong một tháng cụ thể để hiển thị lên lịch.
    * **Query Params:** `?month=10&year=2025`
    * **Response:** `[ { date: '2025-10-13', hasEvent: true }, ... ]`
* **`GET /student/bookings`** (Giao diện lịch)
    * **Mô tả:** Lấy chi tiết các buổi học vào một ngày cụ thể (khi nhấn vào một ngày trên lịch).
    * **Query Params:** `?date=2025-10-13`
    * **Response:** `[ { id, mon, giangVien, gio, diaDiem } ]`


---

### 👩‍🏫 Giảng viên (Tutor)

Các API này yêu cầu token xác thực của giảng viên/tutor.

#### 1. Hồ sơ & Cài đặt (Giao diện cài đặt hồ sơ (Tutor))

* **`GET /tutor/profile`** ✅
    * **Mô tả:** Lấy thông tin cá nhân của tutor (tương tự sinh viên nhưng có thêm "Bằng cấp").
    * **Response:** `{ maSoGV, hoTen, ngaySinh, gioiTinh, soCMND, bangCap, ... }`
* **`PUT /tutor/profile`** ✅
    * **Mô tả:** Cập nhật thông tin cá nhân của tutor.
* **`GET /tutor/booking-history`** ✅
    * **Mô tả:** Lấy lịch sử các buổi họp (tab "Lịch sử đăng ký").

#### 2. Quản lý lịch (Giao diện đăng ký lịch (Tutor))

*Ghi chú: slot nghĩa là một cuộc họp tutor đã mở*

* **`GET /tutor/me/slots`** **`Hoàng`** 
    * **Mô tả:** Lấy danh sách các slot trống mà tutor đã đăng ký để dạy, cùng với trạng thái của chúng.
    * **Query Params:** `?search=Database` (để lọc theo môn).
    * **Response:** `[ { slot_id, mon, ngay, gio, ketQua: 'Thành công' | 'Đang xử lý' | null } ]`
* **`POST /tutor/slots`** **`Nghĩa`** ✅
    * **Mô tả:** Tutor tạo một cuộc họp mới (cho các dòng trống).
    * **Request Body:** `{ mon, ngay, gio }`
* **`DELETE /tutor/slots/{id}`** **`Xuân`**
    * **Mô tả:** Tutor hủy một cuộc họp (khi bỏ check hoặc xóa).

---

### ⚙️ Quản trị viên (Admin)

Các API này yêu cầu token xác thực của Admin.

#### 1. Ghép cặp (Giao diện ghép cặp)

* **`GET /admin/pairing-batches`**
    * **Mô tả:** Lấy danh sách các đợt đăng ký (để điền vào dropdown "Chọn đợt").
    * **Response:** `[ { id: 'W1', name: 'Đợt 1' }, { id: 'W2', name: 'Đợt 2' } ]`
* **`GET /admin/pairings`**
    * **Mô tả:** Lấy danh sách các yêu cầu ghép cặp.
    * **Query Params:** `?batch_id=W1&status=Waiting` (lọc theo đợt và trạng thái).
    * **Response:** `[ { id, hoTenSV, mssv, tutorDeXuat, trangThai } ]`
* **`POST /admin/pairings/{id}/approve`**✅
    * **Mô tả:** Admin nhấn nút "Duyệt".
* **`POST /admin/pairings/{id}/reject`**✅
    * **Mô tả:** Admin nhấn nút "Từ chối"
* **`PUT /admin/pairings/{id}`** ✅
    * **Mô tả:** Admin nhấn nút "Sửa" (ví dụ: thay đổi tutor được gán).
    * **Request Body:** `{ new_tutor_id: '...' }`
* **`POST /admin/pairings/run-ai`**
    * **Mô tả:** Kích hoạt chức năng "Ghép cặp (AI)".
    * **Request Body:** `{ batch_id: 'W1' }`

#### 2. Báo cáo (Giao diện báo cáo)

* **`GET /admin/reports/evaluation`** ✅
    * **Mô tả:** Lấy dữ liệu báo cáo, đánh giá (ví dụ: điểm trung bình).
    * **Query Params:** `?batch_id=W1`
    * **Response:** `{ diemTrungBinh: 4.5, totalReviews: 100, ... }`

---

### 🌎 Công khai (Public)

Các API này không cần xác thực, dùng cho "Giao diện chính".

* **`GET /api/public/supported-fields`** ✅
    * **Mô tả:** Lấy danh sách "Lĩnh vực hỗ trợ".