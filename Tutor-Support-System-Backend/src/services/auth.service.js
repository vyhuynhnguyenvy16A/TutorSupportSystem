import { BadRequestError, InternalServerError, UnAuthorizedError } from "../helpers/handleError.js";
import prisma from "../common/prisma/prisma.init.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const saltRounds = 10

class authService{
    async register(data){
        const email = data.email.trim()
        const password = data.password.trim()
        const hoten = data.hoten
        const MSSV =  data.MSSV.trim()
        const SDT = data.SDT.trim()
        const namhoc = data.namhoc ? data.namhoc : null
        const ngaysinh = data.NGAYSINH ? new Date(data.NGAYSINH) : null
        const gioitinh = data.GIOITINH ? data.GIOITINH : null
        const cccd = data.CCCD

        if (!email || !password || !hoten || !MSSV || !SDT || !cccd){
            throw new BadRequestError(
                "Thiếu thông tin"
            )
        }

        if (!/^[\w.+-]+@hcmut\.edu\.vn$/.test(email)){
            throw new BadRequestError(
                "Phải sử dụng email hcmut.edu.vn"
            )
        }

        if (password.length < 8){
            throw new BadRequestError(
                "Mật khẩu có độ dài nhỏ hơn 8"
            )
        }

        if (!/^\d{10}$/.test(SDT)){
            throw new BadRequestError(
                "Số điện thoại không đúng định dạng"
            )
        }

        if (cccd.length != 12){
            throw new BadRequestError(
                "Số CCCD phải có 12 chữ số"
            )
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                EMAIL: email,
                student: {
                    MSSV: MSSV
                }
            }
        })

        if (existingUser){
            throw new BadRequestError(
                "Email đã được sử dụng cho 1 tài khoản"
            )
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds)
        try{
            const result = await prisma.$transaction(async (tx) =>{
                const newUser = await tx.user.create({
                    data: {
                        EMAIL: email,
                        Password: hashedPassword,
                        Role: "STUDENT",
                        HOTEN: hoten,
                    },

                    select: {
                        EMAIL: true,
                        Role: true,
                        USERID: true,
                        HOTEN: true
                    }
                })

                const newStudent = await tx.student.create({
                    data: {
                        MSSV: MSSV,
                        SODIENTHOAI: SDT,
                        NAMHOC: namhoc ? parseInt(namhoc) : null,
                        USERID: newUser.USERID,
                        NGAYSINH: ngaysinh,
                        GIOITINH: gioitinh,
                        SOCMND: cccd
                    },

                    select: {
                        MSSV: true
                    }
                })

                return { newUser, newStudent }
            })

            return {
                Hoten: result.newUser.HOTEN,
                MSSV: result.newStudent.MSSV,
                email: result.newUser.EMAIL
            }
        } catch(error){
            console.error("Xảy ra lỗi transaction: ", error)

            if (error.code == "P2002"){
                throw new BadRequestError(
                    "Lỗi ràng buộc dữ liệu"
                )
            }
            else{
                throw new InternalServerError(
                    `Xảy ra lỗi server: ${error}`
                ) 
            }
        }
}

    async login(data){
        const email = data.email.trim()
        const password = data.password.trim()

        if (!email || !password){
            throw new BadRequestError(
                "Thiếu thông tin bắt buộc"
            )
        }

        const user = await prisma.user.findFirst({
            where: {
                EMAIL: email
            }
        })

        if (!user){
            throw new BadRequestError(
                "User không tồn tại"
            )
        }

        const isMatch = await bcrypt.compare(password, user.Password)
        if (!isMatch){
            throw new BadRequestError(
                "Sai mật khẩu"
            )
        }

        const payload = {
            userId: user.USERID,
            email: user.EMAIL,
            role: user.Role,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        return {
            userInfo: {
                email: user.EMAIL,
                role: user.Role
            },
            token
        }
    }

    async logout(){
        return { message: "Đăng xuất thành công" }
    }
}

export default new authService();