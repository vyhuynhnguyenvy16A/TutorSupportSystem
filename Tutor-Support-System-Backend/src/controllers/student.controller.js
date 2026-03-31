import studentService from "../services/student.service.js";
import { handleSuccessResponse } from "../helpers/handleResponse.js";
import { BadRequestError, UnAuthorizedError } from "../helpers/handleError.js";

class studentController{
    /**
     * @swagger
     * /student/profile:
     *   get:
     *     summary: Lấy thông tin profile của student
     *     security:
     *       - bearerAuth: []
     *     tags: [Student]
     *     responses:
     *       200:
     *         description: Lấy profile thành công
     *       401:
     *         description: Token không hợp lệ
     *       404:
     *         description: Không tìm thấy profile
     */

    async getProfile(req, res, next){
        try{
            const { userId } = req.user
            
            if (!userId){
                throw new UnAuthorizedError(
                    "Không có quyền truy cập"
                )
            }

            const result = await studentService.getProfile(userId)
            const response = handleSuccessResponse(200, "Lấy hồ sơ thành công", result)

            res.status(200).json(response)
        } catch(error){
            next(error)
        }
    }

    /**
     * @swagger
     * /student/profile:
     *   put:
     *     summary: Cập nhật thông tin hồ sơ sinh viên
     *     security:
     *       - bearerAuth: []
     *     description: API cho phép sinh viên cập nhật thông tin cá nhân bao gồm họ tên, ngày sinh, giới tính, số CMND và số điện thoại.
     *     tags: [Student]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - hoTen
     *               - ngaySinh
     *               - gioiTinh
     *               - soCMND
     *               - soDienThoai
     *               - lichranh
     *             properties:
     *               hoTen:
     *                 type: string
     *                 example: "Lữ Quốc Tuấn"
     *                 description: Họ và tên sinh viên
     *               ngaySinh:
     *                 type: string
     *                 format: date
     *                 example: "2004-10-12"
     *                 description: Ngày sinh của sinh viên (định dạng YYYY-MM-DD)
     *               gioiTinh:
     *                 type: string
     *                 enum: [Nam, Nu, Khac]
     *                 example: "Nam"
     *                 description: Giới tính của sinh viên
     *               soCMND:
     *                 type: string
     *                 example: "079456789123"
     *                 description: Số CMND/CCCD của sinh viên
     *               soDienThoai:
     *                 type: string
     *                 example: "0912345678"
     *                 description: Số điện thoại liên hệ của sinh viên
     *               lichranh:
     *                 type: string
     *                 example: "Tối thứ 2-4-6"
     *                 description: Cập nhật lịch rảnh của sinh viên
     *     responses:
     *       200:
     *         description: Cập nhật hồ sơ thành công
     *       400:
     *         description: Dữ liệu không hợp lệ hoặc thiếu trường bắt buộc
     *       500:
     *         description: Lỗi máy chủ
     */

    async updateProfile(req, res, next){
        try{
            const data = req.body
            const { userId } = req.user
            
            if (!userId){
                throw new UnAuthorizedError(
                    "Không có quyền thực hiện tác vụ này"
                )
            }

            const result = await studentService.updateProfile(userId, data);

            const response = handleSuccessResponse(200, "Update hồ sơ thành công", result)
            res.status(200).json(response)
        } catch(error){
            next(error)
        }
    }

    /**
     * @swagger
     * /student/applications:
     *   post:
     *     summary: Sinh viên tạo đơn đăng ký tìm Tutor
     *     tags: [Đăng ký chương trình]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - dotId
     *               - linhVucId
     *             properties:
     *               dotId:
     *                 type: integer
     *                 example: 2
     *                 description: ID của đợt đăng ký
     *               linhVucId:
     *                 type: integer
     *                 example: 2
     *                 description: ID của lĩnh vực muốn được hỗ trợ
     *               nhuCauHoTro:
     *                 type: string
     *                 example: "Em bị mất gốc môn này, cần tutor ôn tập lại từ đầu..."
     *                 description: Mô tả chi tiết nhu cầu
     *               thanhTich:
     *                 type: string
     *                 example: "GPA kỳ trước 3.5, điểm Toán A..."
     *                 description: Thành tích học tập (nếu có)
     *     responses:
     *       201:
     *         description: Tạo đơn đăng ký thành công
     *       400:
     *         description: Đợt đăng ký đóng hoặc dữ liệu không hợp lệ
     *       404:
     *         description: Không tìm thấy đợt hoặc lĩnh vực
     */

    async createApplication(req, res, next) {
        try {
            const { userId, role } = req.user;
            const data = req.body;

            if (!userId || role !== "STUDENT") {
                throw new UnAuthorizedError("Chức năng chỉ dành cho sinh viên");
            }

            const result = await studentService.createApplication(userId, data);
            
            const response = handleSuccessResponse(201, "Tạo đơn đăng ký thành công", result);
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /student/calendar:
     *   get:
     *     summary: Lấy chi tiết các buổi học trong một tháng để đưa lên lịch
     *     security:
     *       - bearerAuth: []
     *     tags: [Student]
     *     parameters:
     *       - in: query
     *         name: month
     *         required: true
     *         schema:
     *           type: integer
     *         description: Tháng
     *         example: 10
     *       - in: query
     *         name: year
     *         required: true
     *         schema:
     *           type: integer
     *         description: Năm
     *         example: 2025
     * 
     *     responses:
     *       200:
     *         description: Lấy lịch đăng ký thành công
     *       400:
     *         description: Thiếu thông tin truy vấn
     *       401:
     *         description: Chức năng chỉ dành cho sinh viên
     */
    async getCalendar(req, res, next) {
        try {
            const { userId, role } = req.user;
            const { month, year } = req.query;

            if(!userId || role !== "STUDENT") {
                throw new UnAuthorizedError(
                    "Chức năng chỉ dành cho sinh viên"
                );
            }


            if(!month || !year) {
                throw new BadRequestError(
                    "Thiếu thông tin truy vấn"
                )
            }
            const m = parseInt(month);
            const y = parseInt(year);



            const result = await studentService.getCalendar(userId, { m, y });

            const response = handleSuccessResponse(200, "Lấy lịch đăng ký thành công", result);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /student/bookings:
     *   get:
     *     summary: Lấy chi tiết các buổi học vào một ngày cụ thể
     *     security:
     *       - bearerAuth: []
     *     description: API cho phép sinh viên xem danh sách các buổi học trong một ngày cụ thể. Sinh viên chỉ có thể xem buổi học của cặp ghép mà họ đang tham gia.
     *     tags: [Student]
     *     parameters:
     *       - in: query
     *         name: date
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *         description: Ngày cần xem (định dạng YYYY-MM-DD)
     *         example: "2025-11-25"
     *     responses:
     *       200:
     *         description: Lấy lịch học thành công
     *       400:
     *         description: Thiếu tham số 'date' hoặc dữ liệu không hợp lệ
     *       401:
     *         description: Token không hợp lệ hoặc sinh viên không có quyền truy cập
     *       404:
     *         description: Không tìm thấy sinh viên hoặc sinh viên chưa được ghép cặp
     *       500:
     *         description: Lỗi máy chủ
     */
    async getBookings(req, res, next) {
        try {
            const { date } = req.query;
            const { userId, role } = req.user;

            if(!userId || role !== "STUDENT") {
                throw new UnAuthorizedError(
                    "Chức năng chỉ dành cho sinh viên"
                );
            }

            if(!date) {
                throw new BadRequestError(
                    "Thiếu thông tin truy vấn"
                )
            }

            const result = await studentService.getBookings(userId, { date });

            const response = handleSuccessResponse(200, "Lấy thông tin buổi học thành công", result);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export default new studentController();