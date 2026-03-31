import { NotFoundError, BadRequestError } from "../helpers/handleError.js";
import prisma from "../common/prisma/prisma.init.js";
import { ghepcap_TRANGTHAI, student_TRANGTHAITIMTUTOR } from "@prisma/client";

class studentService{
    async getProfile(userId){

        const student = await prisma.student.findFirst({
            where: {
                USERID: userId,
            },

            include: {
                user: true
            }
        })

        if (!student){
            throw new NotFoundError(
                "Không tìm thấy hồ sơ"
            )
        }

        let trangthaitimtutor = student.TRANGTHAITIMTUTOR
        if (student.TRANGTHAITIMTUTOR == 't_m____c'){
          trangthaitimtutor = "Đã tìm được"
        } else {
          trangthaitimtutor = "Chưa tìm được"
        }
        return {
            studentInfo: {
                fullname: student.user.HOTEN,
                mssv: student.MSSV,
                birthday: student.NGAYSINH || null,
                gender: student.GIOITINH || null,
                cccd: student.SOCMND || null,
                phone: student.SODIENTHOAI,
                email: student.user.EMAIL,
                namhoc: student.NAMHOC,
                tinhtrang: trangthaitimtutor,
                lichranh: student.LICHRANH_TEXT                
            }
        }
    }


  async updateProfile(userId, data) {
    const { hoTen, ngaySinh, gioiTinh, soCMND, soDienThoai, lichranh } = data;

    if (soCMND.length != 12){
      throw new BadRequestError(
        "Số CCCD phải có 12 số"
      )
    }

    if (!/^\d{10}$/.test(soDienThoai)){
      throw new BadRequestError(
        "Sai định dạng số điện thoại"
      )
    }

    const student = await prisma.student.findUnique({
            where: {
                USERID: userId
            },

            select: {
                STUDENTID: true
            }
        })

        if (!student){
            throw new BadRequestError(
                "Không tồn tại student"
            )
        }

    try {
      const [updatedUser, updatedStudent] = await prisma.$transaction([
        
        prisma.user.update({
          where: { USERID: userId },
          data: {
            HOTEN: hoTen, 
          },
        }),

        prisma.student.update({
          where: { USERID: userId }, 
          data: {
            NGAYSINH: ngaySinh ? new Date(ngaySinh) : undefined,
            GIOITINH: gioiTinh,
            SOCMND: soCMND,
            SODIENTHOAI: soDienThoai,
            LICHRANH_TEXT: lichranh,
          },
        }),
      ]);

      return {
        mssv: updatedStudent.MSSV, 
        hoTen: updatedUser.HOTEN, 
        ngaySinh: updatedStudent.NGAYSINH,
        gioiTinh: updatedStudent.GIOITINH,
        soCMND: updatedStudent.SOCMND,
        soDienThoai: updatedStudent.SODIENTHOAI,
        email: updatedUser.EMAIL, // Email không đổi
        lichranh: updatedStudent.LICHRANH_TEXT
      };
      
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError("Không tìm thấy hồ sơ để cập nhật.");
      }
      throw error;
    }
  }

  async createApplication(userId, data) {
        const { dotId, linhVucId, nhuCauHoTro, thanhTich } = data;

        // 1. Tìm thông tin Student từ UserId
        const student = await prisma.student.findUnique({
            where: { USERID: userId },
            select: { STUDENTID: true }
        });

        if (!student) {
            throw new NotFoundError("Không tìm thấy thông tin sinh viên");
        }

        // 2. Kiểm tra Đợt đăng ký có tồn tại và đang MỞ không
        const dotDangKy = await prisma.dotdangky.findUnique({
            where: { DOTID: parseInt(dotId) }
        });

        if (!dotDangKy) {
            throw new NotFoundError("Không tìm thấy đợt đăng ký");
        }

        // Kiểm tra enum status: 'M_' maps to 'Mở', 'ng' maps to 'Đóng'
        if (dotDangKy.TRANGTHAI !== "M_") { 
            throw new BadRequestError("Đợt đăng ký này hiện đang đóng");
        }

        // 3. Kiểm tra Lĩnh vực có tồn tại không
        const linhVuc = await prisma.linhvuc.findUnique({
            where: { LINHVUCID: parseInt(linhVucId) }
        });

        if (!linhVuc) {
            throw new NotFoundError("Không tìm thấy lĩnh vực hỗ trợ này");
        }

        // 4. Kiểm tra trùng lặp: Sinh viên đã đăng ký môn này trong đợt này chưa?
        const existingApp = await prisma.dondangky.findFirst({
            where: {
                STUDENTID: student.STUDENTID,
                DOTID: parseInt(dotId),
                LINHVUCID: parseInt(linhVucId)
            }
        });

        if (existingApp) {
            throw new BadRequestError("Bạn đã đăng ký lĩnh vực này trong đợt này rồi.");
        }

        // 5. Tạo đơn đăng ký mới
        const newApplication = await prisma.dondangky.create({
            data: {
                STUDENTID: student.STUDENTID,
                DOTID: parseInt(dotId),
                LINHVUCID: parseInt(linhVucId),
                NHUCAUHOTRO: nhuCauHoTro || "",
                THANHTICH: thanhTich || "",
                TRANGTHAICHODUYET: "Ch__Duy_t"
            }
        });

        return newApplication;
    }

    async getCalendar(userId, data) {
      const { m, y } = data;

      const student = await prisma.student.findUnique({
        where: {
          USERID: userId
        },
        
        select: {
          STUDENTID: true
        }
      });

      if(!student) {
        throw new BadRequestError(
          "Không có học sinh này trong hệ thống"
        )
      }

      const studentId = student.STUDENTID;

      const capIds = await prisma.ghepcap.findMany({
        where: {
          dondangky: {
            STUDENTID: parseInt(studentId)
          },
          TRANGTHAI: ghepcap_TRANGTHAI.x_c_nh_n
        },
        select: {
          GHEPCAPID: true
        }
      });

      if(!capIds || capIds.length == 0) {
        throw new NotFoundError(
          "Student này chưa được ghép cặp"
        )
      }

      const startOfDay = new Date(y, m - 1, 1);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(y, m, 0);
      endOfDay.setHours(23, 59, 59, 999);
      console.log(startOfDay, endOfDay);

      const pairIDs = capIds.map((id) => id.GHEPCAPID)

      const bookings = await prisma.lichhop.findMany({
        where: {
          GhepCapID: { in: pairIDs},
          THOIGIANBATDAU: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        select: {
          TIEUDE: true,
          THOIGIANBATDAU: true,
          LOAIHOP: true,
          LINKHOP: true,
          DIADIEM: true
        }
        })


      return bookings;
    }

    async getBookings(userId, data) {
      const { date } = data;

      const user = await prisma.student.findUnique({
        where: {
          USERID: userId
        },
        select: {
          STUDENTID: true
        }
      });

      if(!user) {
        throw new BadRequestError(
          "Không có sinh viên này trong hệ thống"
        )
      }

      const studentId = user.STUDENTID;

      const capIds = await prisma.ghepcap.findMany({
        where: {
          dondangky: {
            STUDENTID: parseInt(studentId)
          }
        },
        select: {
          GHEPCAPID: true
        }
      });

      if(!capIds || capIds.length == 0) {
        throw new BadRequestError(
          "Student này chưa được ghép cặp"
        )
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const pairIDs = capIds.map((id) => id.GHEPCAPID)

      const bookings = await prisma.lichhop.findMany({
        where: {
          GhepCapID: { in: pairIDs },
          THOIGIANBATDAU: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        select: {
          TIEUDE: true,
          THOIGIANBATDAU: true,
          LOAIHOP: true,
          LINKHOP: true,
          DIADIEM: true
        }
      });

      return bookings;
    }
}

export default new studentService();