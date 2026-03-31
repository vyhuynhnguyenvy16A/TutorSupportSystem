import adminService from "../services/admin.service.js";
import { handleSuccessResponse } from "../helpers/handleResponse.js";
import { UnAuthorizedError } from "../helpers/handleError.js";

class adminController{
    /**
     * @swagger
     * /admin/reports/evaluation:
     *   get:
     *     summary: Lấy thông tin đánh giá dựa theo đợt
     *     security:
     *       - bearerAuth: []
     *     tags: [Báo cáo]
     *     parameters:
     *       - in: query
     *         name: batchID
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID của đợt
     *         example: 1
     *     responses:
     *       200:
     *         description: Lấy thông tin đánh giá thành công
     *       404:
     *         description: không tìm thấy đánh giá nào tại đợt này
     *       400:
     *         description: Đợt này không tồn tại
     *       500:
     *         description: Lỗi server
     */
    async getEvals(req, res, next){
        try{
            const { role } = req.user
            if (role != 'ADMIN'){
                throw new UnAuthorizedError(
                    "Không có quyền truy cập"
                )
            }
            
            const { batchID } = req.query
            const result = await adminService.getEvals(batchID)
            const response = handleSuccessResponse(200, "Lấy thông tin đánh giá thành công", result)

            res.status(200).json(response)
        } catch(error){
            next(error)
        }
    } 

    /**
     * @swagger
     * /admin/register:
     *   post:
     *     summary: Đăng ký tài khoản cho admin
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
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "admin1@hcmut.edu.vn"
     *                 description: Email người dùng
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "12345678"
     *                 description: mật khẩu người dùng
     *               HoTen:
     *                 type: string
     *                 example: "Admin1"
     *                 description: tên Admin
     *     responses:
     *       200:
     *         description: Đăng ký thành công
     *       400: 
     *         description: Thông tin không hợp lệ
     *       500:
     *         description: Server lỗi
     */
    async register(req, res, next){
        try{
            const data = req.body
            const result = await adminService.register(data)
            const response = handleSuccessResponse(200, "Đăng ký thành công", result)

            res.status(200).json(response)
        } catch(error){
            next(error)
        }
    }

    /**
     * @swagger
     * /admin/pairings/{GHEPCAPID}:
     *   put:
     *     summary: Cập nhật ghép cặp (admin sửa tutor được gán)
     *     description: Admin nhấn nút "Sửa" để thay đổi tutor được gán cho một ghép cặp cụ thể.
     *     tags: [Admin]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: GHEPCAPID
     *         required: true
     *         schema:
     *           type: string
     *         description: ID của ghép cặp cần chỉnh sửa
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               TUTORID:
     *                 type: string
     *                 example: "3"
     *                 description: ID của tutor mới để cập nhật
     *     responses:
     *       200:
     *         description: Cập nhật ghép cặp thành công
     *       400:
     *         description: Dữ liệu không hợp lệ
     *       404:
     *         description: Không tìm thấy ghép cặp
     */
    async editPairing(req, res, next){
        try{

            const { GHEPCAPID } = req.params;
            const { TUTORID } = req.body;
            const { role } = req.user;
            console.log(role)
            if (role != "ADMIN"){
                throw new UnAuthorizedError(
                    "Không có quyền truy cập"
                )
            }

            const result = await adminService.editPairing(GHEPCAPID, TUTORID)
            const response = handleSuccessResponse(200, "Cập nhật ghép cặp thành công", result)

            res.status(200).json(response)

        } catch(error){
            next(error)
        }
    }

    /**
     * @swagger
     * /admin/pairings/{GHEPCAPID}/approve:
     *   post:
     *     summary: Duyệt ghép cặp
     *     description: Admin nhấn nút "Duyệt" cho một ghép cặp đang chờ duyệt.
     *     tags: [Admin]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: GHEPCAPID
     *         required: true
     *         schema:
     *           type: string
     *         description: ID của ghép cặp cần duyệt
     *     responses:
     *       200:
     *         description: Duyệt ghép cặp thành công
     *       400:
     *         description: Dữ liệu không hợp lệ hoặc trạng thái không phù hợp
     *       404:
     *         description: Không tìm thấy ghép cặp
     *       401:
     *         description: Không có quyền truy cập
     */
    async approvePairing(req, res, next) {
        try {
            const { GHEPCAPID } = req.params;
            const { role } = req.user;

            if (role !== "ADMIN") {
                throw new UnAuthorizedError("Không có quyền truy cập");
            }

            const result = await adminService.approvePairing(GHEPCAPID);
            const response = handleSuccessResponse(
                200,
                "Duyệt ghép cặp thành công",
                result
            );

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /admin/pairings/{GHEPCAPID}/reject:
     *   post:
     *     summary: Từ chối ghép cặp
     *     description: Admin nhấn nút "Từ chối" cho một ghép cặp đang chờ duyệt.
     *     tags: [Admin]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: GHEPCAPID
     *         required: true
     *         schema:
     *           type: string
     *         description: ID của ghép cặp cần từ chối
     *     responses:
     *       200:
     *         description: Từ chối ghép cặp thành công
     *       400:
     *         description: Dữ liệu không hợp lệ hoặc trạng thái không phù hợp
     *       404:
     *         description: Không tìm thấy ghép cặp
     *       401:
     *         description: Không có quyền truy cập
     */
    async rejectPairing(req, res, next) {
        try {
            const { GHEPCAPID } = req.params;
            const { role } = req.user;

            if (role !== "ADMIN") {
                throw new UnAuthorizedError("Không có quyền truy cập");
            }

            const result = await adminService.rejectPairing(GHEPCAPID);
            const response = handleSuccessResponse(
                200,
                "Từ chối ghép cặp thành công",
                result
            );

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
    /**
     * @swagger
     * /admin/pairings:
     *   get:
     *     summary: "Lấy danh sách các yêu cầu ghép cặp"
     *     security:
     *       - bearerAuth: []
     *     tags: [Admin]
     *     parameters:
     *       - in: query
     *         name: batch_id
     *         schema:
     *           type: string
     *         description: "Mã đợt đăng ký (ví dụ: W1)"
     *     responses:
     *       200:
     *         description: "Lấy danh sách ghép cặp thành công"
     */
    async getPairings(req, res, next) {
        try {
            const { batch_id } = req.query;
            const { role } = req.user;

                if (role != "ADMIN") {
                    throw new UnAuthorizedError("Không có quyền truy cập");
                }
            const result = await adminService.getPairings(batch_id);

            const response = handleSuccessResponse(
                200,
                "Lấy danh sách ghép cặp thành công",
                result
            );

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }


    /**
     * @swagger
     * /admin/tutors/{tutorId}/fields:
     *   put:
     *     summary: Admin chỉnh sửa lĩnh vực cho tutor
     *     tags: [Admin]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: tutorId
     *         required: true
     *         schema:
     *           type: integer
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
    async updateTutorFields(req, res, next) {
        try {
            const { tutorId } = req.params;
            const { fieldIds } = req.body;
            const { role } = req.user;

            if (role !== "ADMIN") throw new UnAuthorizedError("Không có quyền truy cập");

            const result = await adminService.updateTutorFields(tutorId, fieldIds);
            const response = handleSuccessResponse(200, "Cập nhật thành công", result);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /admin/pairings/run-ai:
     *   post:
     *     summary: Chạy thuật toán ghép cặp tự động (AI Cosine Similarity)
     *     description: Ghép dựa trên độ tương đồng của văn bản Lịch Rảnh.
     *     tags: [Ghép cặp]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - batchId
     *             properties:
     *               batchId:
     *                 type: integer
     *                 example: 1
     *     responses:
     *       200:
     *         description: Chạy ghép cặp thành công
     */

    async runAIPairing(req, res, next) {
        try {
            const { batchId } = req.body;
            const { role } = req.user;

            if (role !== "ADMIN") throw new UnAuthorizedError("Không có quyền truy cập");
            if (!batchId) throw new BadRequestError("Thiếu batchId");

            const result = await adminService.runAIPairing(batchId);
            const response = handleSuccessResponse(200, "AI ghép cặp hoàn tất", result);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /admin/forms/{batch_id}:
     *   get:
     *     summary: "Lấy danh sách các đơn đăng ký"
     *     security:
     *       - bearerAuth: []
     *     tags: [Admin]
     *     parameters:
     *       - in: path
     *         name: batch_id
     *         required: true
     *         schema:
     *           type: string
     *         description: "Mã đợt đăng ký (ví dụ: W1)"
     *     responses:
     *       200:
     *         description: "Lấy danh sách đơn đăng ký thành công"
     */

    async getApplyingForm(req, res, next){
        try{
            const { role } = req.user
            if (role !== "ADMIN"){
                throw new UnAuthorizedError("Chỉ có admin mới có quyền truy cập")
            }

            const { batch_id } = req.params
            console.log(req.params)
            console.log(batch_id)
            const result = await adminService.getApplyForm(batch_id)
            const response = handleSuccessResponse(200, "Lấy danh sách đơn đăng ký thành công", result)

            res.status(200).json(response)
        } catch(error){
            next(error)
        }
    }
}

export default new adminController();