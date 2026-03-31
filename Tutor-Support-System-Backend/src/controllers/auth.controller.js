import authService from "../services/auth.service.js";
import { handleSuccessResponse } from "../helpers/handleResponse.js";

class AuthController{

    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: Đăng ký tài khoản studentd
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
     *               - MSSV
     *               - SDT
     *               - namhoc
     *               - NGAYSINH
     *               - GIOITINH
     *               - CCCD
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "phap@hcmut.edu.vn"
     *                 description: Email người dùng
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "1234"
     *                 description: mật khẩu người dùng
     *               hoten:
     *                 type: string
     *                 example: "lữ quốc pháp"
     *                 description: tên người dùng
     *               MSSV:  
     *                 type: string
     *                 example: "2312562"
     *                 description: mã số sinh viên
     *               SDT:
     *                 type: string
     *                 example: "0123456789"
     *                 description: số điện thoại
     *               namhoc:
     *                 type: string
     *                 example: '3'
     *                 description: sinh viên năm
     *               NGAYSINH:
     *                 type: string
     *                 example: "2005-12-06"
     *                 description: Ngày sinh
     *               GIOITINH:
     *                 type: string
     *                 example: "Nam"
     *                 description: Giới tính
     *               CCCD:
     *                 type: string
     *                 example: "091991991999"
     *                 description: Số CCCD
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
            const data = req.body;
            const result = await authService.register(data);
            const response = handleSuccessResponse(200, "Đăng ký thành công", result);

            res.status(200).json(response)
        } catch(error){
            next(error)
        }
    }


    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Đăng nhập student
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
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "phap@hcmut.edu.vn"
     *                 description: Email hoặc tài khoản đăng nhập
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "12345678"
     *                 description: Mật khẩu
     *     responses:
     *       200:
     *         description: Đăng nhập thành công
     *       400:
     *         description: Thiếu thông tin đăng nhập
     *       401:
     *         description: Thông tin đăng nhập không đúng hoặc không phải tài khoản khách hàng
     *       500:
     *         description: Lỗi hệ thống trong quá trình đăng nhập
     */
    async login(req, res, next){
        try{
            const data = req.body;
            const result = await authService.login(data);
            const response = handleSuccessResponse(200, "Đăng nhập thành công", result);

            res.status(200).json(response)
        } catch(error){
            next(error)
        }
    }

    /**
     * @swagger
     * post:
     * /auth/logout:
     *   post:
     *     summary: Đăng xuất
     *     tags: [Auth]
     *   responses:
     *     200:
     *       description: Đăng xuất thành công
     *     500:
     *       description: Internal Server Error
     */

    async logout(req, res, next){
        try{
            const result = await authService.logout();
            const response = handleSuccessResponse(200, "Đăng xuất thành công", result)

            res.status(200).json(response)
        } catch(error){
            next(error)
        }
    }
}

export default new AuthController();