import { handleSuccessResponse } from "../helpers/handleResponse.js";
import { BadRequestError, UnAuthorizedError } from "../helpers/handleError.js";
import tutorService from "../services/tutor.service.js";

class tutorController {

    /**
     * @swagger
     * /tutor/register:
     *   post:
     *     summary: Tạo tài khoản cho tutor
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - HoTen
     *               - SDT
     *               - BOMON
     *               - BANGCAP
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "nghia@hcmut.edu.vn"
     *                 description: Email người dùng
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "12345678"
     *                 description: mật khẩu người dùng
     *               HoTen:
     *                 type: string
     *                 example: "Trần Trọng Nghĩa"
     *                 description: tên người dùng
     *               SDT:
     *                 type: string
     *                 example: "0123456789"
     *                 description: số điện thoại
     *               BOMON:
     *                 type: string
     *                 example: "Kỹ thuật máy tính"
     *                 description: Bộ môn
     *               BANGCAP:
     *                 type: string
     *                 example: Tiến sĩ
     *                 description: Bằng cấp, học vị
     *     responses:
     *       200:
     *         description: Tạo tài khoản cho tutor thành công
     *       400:
     *         description: Đầu vào không hợp lệ
     */

    async register(req, res, next){
        try{
            const data = req.body
            const result = await tutorService.register(data)
            const response = handleSuccessResponse(200, "Tạo tài khoản cho tutor thành công", result)

            res.status(200).json(response)
        } catch(error){
            next(error)
        }
    }

    /**
     * @swagger
     * /tutor/profile:
     *   get:
     *     summary: Lấy thông tin profile của tutor
     *     security:
     *       - bearerAuth: []
     *     tags: [Tutor]
     *     responses:
     *       200:
     *         description: Lấy profile thành công
     *       401:
     *         description: Token không hợp lệ
     *       404:
     *         description: Không tìm thấy profile
     */
    async getProfile(req, res, next) {
        try {
            const { userId } = req.user;

            if (!userId){
                throw new UnAuthorizedError(
                    "Không có quyền thực hiện tác vụ"
                )
            }

            const result = await tutorService.getProfile(userId);
            const response = handleSuccessResponse(200, "Lấy profile tutor thành công", result);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /tutor/profile:
     *   put:
     *     summary: Cập nhật profile giảng viên
     *     tags: [Tutor]
     *     security:
     *       - bearerAuth: []
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
     *               - BOMON
     *               - BANGCAP
     *               - TRANGTHAITHAMGIA
     *               - LICHRANH_TEXT
     *             properties:
     *               hoTen:
     *                 type: string
     *                 example: "Nguyễn Văn A"
     *               ngaySinh:
     *                 type: string
     *                 format: date
     *                 example: "1990-05-15"
     *               gioiTinh:
     *                 type: string
     *                 enum: [Nam, Nu, Khac]
     *                 example: "Nam"
     *               soCMND:
     *                 type: string
     *                 example: "123456789000"
     *               soDienThoai:
     *                 type: string
     *                 example: "0909123456"
     *               BOMON:
     *                 type: string
     *                 example: "Công nghệ thông tin"
     *               BANGCAP:
     *                 type: string
     *                 example: "Thạc sĩ"
     *               TRANGTHAITHAMGIA:
     *                 type: string
     *                 enum: ["Sẵn Sàng", "Tạm Dừng"]
     *                 example: "Sẵn Sàng"
     *               LICHRANH_TEXT:
     *                 type: string
     *                 example: "Thứ 2-4-6 từ 14:00 đến 18:00"
     *     responses:
     *       200:
     *         description: Cập nhật profile thành công
     *       400:
     *         description: Dữ liệu không hợp lệ
     *       401:
     *         description: Không có hoặc token không hợp lệ
     *       404:
     *         description: Không tìm thấy giảng viên
     */

    async updateProfile(req, res, next) {
        try {
            const data = req.body;
            const { userId } = req.user;

            if (!userId){
                throw new UnAuthorizedError(
                    "Không có quyền thực hiện"
                )
            }
            const result = await tutorService.updateProfile(userId, data);
            const response = handleSuccessResponse(200, "Cập nhật hồ sơ thành công", result);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /tutor/bookings:
     *   get:
     *     summary: Lấy chi tiết các buổi học vào một ngày cụ thể
     *     security:
     *       - bearerAuth: []
     *     tags: [Tutor]
     *     responses:
     *       200:
     *         description: Lấy lịch học thành công
     *       400:
     *         description: Thiếu tham số 'date' hoặc 'studentId'
     */
    async getBookings(req, res, next) {
        try {
            const { userId, role } = req.user;
            if (!userId || role != "TUTOR"){
                throw new UnAuthorizedError(
                    "Không có quyền truy cập"
                )
            }

            const result = await tutorService.getBookings(userId);
            const response = handleSuccessResponse(200, "Lấy lịch học thành công", result);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

  /**
 * @swagger
 * /tutor/slots/{id}:
 *   delete:
 *     summary: Xóa một buổi học
 *     tags: [Tutor]
 *     security:
 *       - bearerAuth: []       
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của buổi học cần xóa
 *     responses:
 *       200:
 *         description: Xóa buổi học thành công
 *       400:
 *         description: Request không hợp lệ
 *       401:
 *         description: Thiếu token hoặc token không hợp lệ
 *   
 */
    async deletebooking(req, res, next){
        try{
            const id = req.params.id   
            const userid = req.user.userId
            const result = await tutorService.deletebooking(id, userid)
            const response = handleSuccessResponse(200, "Xóa buổi học thành công", result)
            res.status(200).json(response);
        } catch(error){
            next(error)
        }
    }
    /**
     * @swagger
     * /tutor/slots:
     *   post:
     *     summary: Tạo lịch họp.
     *     tags: [Lịch họp]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - mon
     *               - ngay
     *               - gio
     *             properties:
     *               mon:
     *                 type: string
     *                 example: 1
     *               ngay:
     *                 type: string
     *                 format: date
     *                 example: "2025-11-17"
     *               gio:
     *                 type: string
     *                 example: "14:30"    
     *                 pattern: "^([01][0-9]|2[0-3]):[0-5][0-9]$"
     *     responses:
     *       201:
     *         description: Tạo lịch học thành công
     *       400:
     *         description: Dữ liệu không hợp lệ
     *       401:
     *         description: Không có hoặc token không hợp lệ
     *       404:
     *         description: Các lỗi liên quan không thể tạo lịch họp
     *       500:
     *         description: Database bị lỗi!
     */
    async makeSlots(req, res, next) {
        try {
            const { userId, role } = req.user;
            const { mon, ngay, gio }  = req.body;

            if (!mon || !ngay || !gio) {
                throw new BadRequestError("Thiếu thông tin cuộc họp.");
            }

            if (!userId || role != "TUTOR"){
                throw new UnAuthorizedError(
                    "Không có quyền truy cập"
                )
            }
            const result = await tutorService.makeSlots(userId, {mon, ngay, gio});
            const response = handleSuccessResponse(201, "Tạo lịch hoc thành công!", result);
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /tutor/me/slots:
     *   get:
     *     summary: Lấy danh sách slot tutor đã đăng ký
     *     security:
     *       - bearerAuth: []
     *     tags:
     *       - Tutor
     *     parameters:
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Lọc các slot theo ID môn học (lĩnh vực)
     *         example: "1"
     *     responses:
     *       200:
     *         description: Lấy danh sách slot thành công
     *       401:
     *         description: Token không hợp lệ
     *       404:
     *         description: Không tìm thấy tutor
     */
    async getMySlots(req, res, next) {
        try {
            // Lấy userId và role từ token (đã qua middleware verifyToken)
            const { userId, role } = req.user;

            // Lấy tham số ?search=
            const { search } = req.query; 

            // Phân quyền
            if (!userId || role !== "TUTOR"){
                throw new UnAuthorizedError(
                    "Không có quyền truy cập"
                )
            }
            
            // Gọi sang lớp Service để xử lý logic
            const result = await tutorService.getMySlots(userId, search);
            
            const response = handleSuccessResponse(200, "Lấy danh sách slot thành công", result);
            res.status(200).json(response);

        } catch (error) {
            next(error);
        }
    }

/**
     * @swagger
     * /tutor/fields:
     *   post:
     *     summary: Tutor cập nhật lĩnh vực chuyên môn
     *     tags: [Tutor]
     *     security:
     *     - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               fieldIds:
     *                 type: array
     *                 items:
     *                   type: integer
     *                   example: [1, 2]
     *     responses:
     *       200:
     *         description: Cập nhật thành công
     */
    async registerFields(req, res, next) {
        try {
            const { userId, role } = req.user;
            const { fieldIds } = req.body; 

            if (!userId || role !== "TUTOR") {
                throw new UnAuthorizedError("Không có quyền truy cập");
            }

            if (!Array.isArray(fieldIds)) {
                throw new BadRequestError("Dữ liệu fieldIds phải là một mảng");
            }

            const result = await tutorService.registerFields(userId, fieldIds);
            const response = handleSuccessResponse(200, "Cập nhật lĩnh vực thành công", result);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export default new tutorController();
