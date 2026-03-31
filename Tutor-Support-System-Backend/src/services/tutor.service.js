import { BadRequestError, NotFoundError } from "../helpers/handleError.js";
import bcrypt from "bcrypt"
import prisma from "../common/prisma/prisma.init.js";    

const saltRounds = 10

// Helper để dịch từ "Sẵn Sàng" -> "S_n_S_ng"
const mapStatusToEnum = (status) => {
    if (status === "Sẵn Sàng") {
        return "S_n_S_ng";
    }
    if (status === "Tạm Dừng") {
        return "T_m_D_ng";
    }
    return undefined; // Hoặc ném lỗi nếu muốn
};

// Helper để dịch ngược từ "S_n_S_ng" -> "Sẵn Sàng"
const mapEnumToStatus = (enumValue) => {
    if (enumValue === "S_n_S_ng") {
        return "Sẵn Sàng";
    }
    if (enumValue === "T_m_D_ng") {
        return "Tạm Dừng";
    }
    return null;
};


class tutorService{

    async register(data){
        const email = data.email.trim()
        const password = data.password.trim()
        const hoten = data.HoTen
        const SDT = data.SDT.trim()
        const BOMON = data.BOMON || null
        const BANGCAP = data.BANGCAP || null

        if (!email || !password || !hoten || !SDT ){
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

        const existingUser = await prisma.user.findFirst({
            where: {
                EMAIL: email,
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
                        Role: "TUTOR",
                        HOTEN: hoten,
                    },

                    select: {
                        EMAIL: true,
                        Role: true,
                        USERID: true,
                        HOTEN: true
                    }
                })

                const newTutor = await tx.tutor.create({
                    data: {
                        SODIENTHOAI: SDT,
                        USERID: newUser.USERID,
                        BOMON: BOMON,
                        BANGCAP: BANGCAP
                    },

                    select: {
                        TUTORID: true
                    }
                })

                return { newUser, newTutor }
            })

            return {
                Hoten: result.newUser.HOTEN,
                TUTORID: result.newTutor.TUTORID,
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
    async getProfile(userId){
        const tutor = await prisma.tutor.findUnique({
            where: {
                USERID: userId
            },

            include: {
                user: true,
                tutor_linhvuc: {
                    include: {
                        linhvuc: true
                    }
                }
            }
        })

        if (!tutor){
            throw new NotFoundError(
                "Không tìm thấy tutor"
            )
        }

        return {
            tutorInfo: {
                email: tutor.user.EMAIL,
                hoten: tutor.user.HOTEN,
                tutorID: tutor.TUTORID,
                msgv: tutor.MASOGV,
                SDT: tutor.SODIENTHOAI,
                CMND: tutor.SOCMND,
                NGAYSINH: tutor.NGAYSINH || null,
                GIOITINH: tutor.GIOITINH || null,
                BOMON: tutor.BOMON || null,
                BANGCAP: tutor.BANGCAP || null,
                TRANGTHAI: mapEnumToStatus(tutor.TRANGTHAITHAMGIA) || null,
                LICHRANH: tutor.LICHRANH_TEXT || null,
                LINHVUC: tutor.tutor_linhvuc.map(item => item.linhvuc.LINHVUCID) || []
            }
        }
        
    }

    async updateProfile(userId, data){
        const { hoTen, ngaySinh, gioiTinh, soCMND, soDienThoai, BOMON, BANGCAP, TRANGTHAITHAMGIA, LICHRANH_TEXT } = data;

        if (!/^\d{10}$/.test(soDienThoai)){
            throw new BadRequestError(
                "Số điện thoại không đúng định dạng"
            )
        }

        if (soCMND.length != 12){
            throw new BadRequestError(
                "Số CCCD phải có 12 số"
            )
        }

        const tutor = await prisma.tutor.findUnique({
            where: {
                USERID: userId
            },

            select: {
                TUTORID: true
            }
        })

        if (!tutor){
            throw new BadRequestError(
                "Không tồn tại tutor"
            )
        }

        try{
            const [updateUser, updateTutor] = await prisma.$transaction([
                prisma.user.update({
                    where: {
                        USERID: userId
                    },

                    data: {
                        HOTEN: hoTen
                    }
                }),

                prisma.tutor.update({
                    where: {
                        USERID: userId
                    },

                    data: {
                        NGAYSINH: new Date(ngaySinh) || null,
                        GIOITINH: gioiTinh,
                        SOCMND: soCMND,
                        SODIENTHOAI: soDienThoai,
                        BOMON: BOMON,
                        BANGCAP: BANGCAP,
                        TRANGTHAITHAMGIA: mapStatusToEnum(TRANGTHAITHAMGIA),
                        LICHRANH_TEXT: LICHRANH_TEXT
                    }
                })
            ])

            return {
                newInfo: {
                    hoTen: updateUser.HOTEN,
                    ngaySinh: updateTutor.NGAYSINH,
                    gioitinh: updateTutor.GIOITINH,
                    soCMND: updateTutor.SOCMND,
                    soDienThoai: updateTutor.SODIENTHOAI,
                    BOMON: updateTutor.BOMON,
                    BANGCAP: updateTutor.BANGCAP,
                    TRANGTHAI: mapEnumToStatus(updateTutor.TRANGTHAITHAMGIA),
                    LICHRANH_TEXT: updateTutor.LICHRANH_TEXT
                }
            }
        } catch (error){
            if (error.code == 'P2025'){
                throw new NotFoundError("Không tìm thấy user")
            }

            throw error
        }
    }

    async getBookings(userId){

        // find tutorID
        const tutor = await prisma.tutor.findUnique({
            where: {
                USERID: userId
            },

            select: {
                TUTORID: true
            }
        })

        if (!tutor){
            throw new BadRequestError(
                "Tutor không tồn tại"
            )
        }

        const tutorID = tutor.TUTORID;

        // find GHEPCAPID
        const capIDs = await prisma.ghepcap.findMany({
            where: {
                TUTORID: parseInt(tutorID)
            },

            select: {
                GHEPCAPID: true
            }
        })

        if (!capIDs){
            throw new NotFoundError(
                "Tutor này chưa được ghép cặp"
            )
        }
        const ghepcapIDs = capIDs.map((id) => id.GHEPCAPID)


        const bookings = await prisma.lichhop.findMany({
            where: {
                GhepCapID: { in: ghepcapIDs },
            },

            select: {
                TIEUDE: true,
                THOIGIANBATDAU: true,
                LOAIHOP: true,
                LINKHOP: true,
                DIADIEM: true
            }
        })

        if (!bookings || bookings.length == 0){
            throw new NotFoundError(
                "Không tìm được cuộc họp"
            )
        }

        return {
            bookings
        }
        
    }

    async makeSlots(userId, data){
        // Nhận vào là môn, ngày, giờ
        // DateTime: 9999-12-31T23:59:59 -> "{ngay}T{gio}"
        // Nen co check trung lap
        const { mon, ngay, gio } = data;
        console.log(data);

        // find tutorID
        try {
            const tutor = await prisma.tutor.findUnique({
                where: {
                    USERID: userId
                },

                select: {
                    TUTORID: true
                }
            })

            if (!tutor){
                throw new NotFoundError(
                    "Tutor không tồn tại"
                )
            }

            const tutorID = tutor.TUTORID;
            // Giả sử môn gửi lên là LINHVUCID
            // Kiểm tra xem lĩnh vực có thuộc tutor_linhvuc không
            const linhVucId = parseInt(mon);
            const isTutorInLinhVuc = await prisma.tutor_linhvuc.findFirst({
                where: {
                    TUTORID: tutorID,
                    LINHVUCID: linhVucId
                }
            })
            
            if(!isTutorInLinhVuc) {
                throw new NotFoundError(
                    "Tutor không thể đăng ký lịch học cho lĩnh vực này"
                )
            }

            // Gộp lại ngày giờ để về DateTime: 2025-11-17T19:00:00
            const startMeetingTime = new Date(`${ngay}T${gio}:00`);
            console.log(tutorID)
            // Tìm các ghepcap thỏa mãn linhVucId và thuộc tutorID này
            const ghepcaps = await prisma.ghepcap.findMany({
                where: {
                    TUTORID: tutorID,
                    TRANGTHAI: "x_c_nh_n",
                    dondangky: {
                        LINHVUCID: linhVucId
                    }
                },
                include: {
                    dondangky: { include: { linhvuc : true }}
                }
            })

            console.log(!ghepcaps)
            if(!ghepcaps || ghepcaps.length == 0) {
                throw new NotFoundError(
                    "Hiện thời không có sinh viên nào đăng ký lĩnh vực này!"
                )
            }

            // Nếu đã có được ghép cặp thì tiến hành tạo lịch họp tương ứng
            // Nên check xem đã có lịch họp nào trùng giờ với lịch họp nào của TUTOR này chưa:
            const existingMeeting = await prisma.lichhop.findFirst({
                where: {
                    ghepcap: {
                        tutor: {
                            TUTORID: tutorID
                        }
                    },
                    THOIGIANBATDAU: startMeetingTime
                }
            })

            console.log(existingMeeting)

            if(existingMeeting) {
                throw new BadRequestError(
                    "Đã có lịch họp trong khung giờ này, vui lòng chọn khung giờ khác!"
                )
            }

            const LinhVuc = await prisma.linhvuc.findFirst({
                where: {
                    LINHVUCID: parseInt(mon)
                },

                select: {
                    TENLINHVUC: true
                }
            })

            const dataToInsert = ghepcaps.map(id => ({
                GhepCapID: id.GHEPCAPID, 
                TIEUDE: `Buổi học ${LinhVuc.TENLINHVUC}`, 
                NOIDUNG: "Tutor tạo một lịch học mới",
                THOIGIANBATDAU: startMeetingTime,
                LOAIHOP: "Online",
                LINKHOP: "mmxx-mma-ddd"
            }));
            //Nếu chưa có thì tạo lịch họp mới
            const newLichHop = await prisma.lichhop.createMany({
                data: dataToInsert
            })

            return {
                newLichHop: {
                    tieuDe: newLichHop.TIEUDE,
                    noiDung: newLichHop.NOIDUNG,
                    thoiGianBatDau: newLichHop.THOIGIANBATDAU,
                    loaiHop: newLichHop.LOAIHOP,
                    linkHop: newLichHop.LINKHOP,
                    diaDiem: newLichHop.DIADIEM
                }
            }
        }
        catch (err) {
            if (err.code == 'P2025'){
                throw new NotFoundError("Lỗi DB")
            }
            throw err;
        }
    }



    async getMySlots(userId, search) {
        // 1. Tìm TUTORID từ USERID
        const tutor = await prisma.tutor.findUnique({
            where: { USERID: userId },
            select: { TUTORID: true }
        });

        if (!tutor) {
            throw new NotFoundError("Không tìm thấy tutor");
        }
        const tutorId = tutor.TUTORID;

        const slots = await prisma.lichhop.findMany({
            where: {
                ghepcap: {
                    dondangky: {
                        LINHVUCID: parseInt(search)
                    },
                    TUTORID: tutor.TUTORID
                }
            },
            select: {
                HOPID: true,
                THOIGIANBATDAU: true,
                ghepcap: {
                    select: {
                        TRANGTHAI: true,
                        dondangky: {
                            select: {
                                linhvuc: {
                                    select: {
                                        TENLINHVUC: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                THOIGIANBATDAU: 'asc'
            }
        });

        // 4. Map dữ liệu trả về
        return slots.map(slot => {
            const dateObj = new Date(slot.THOIGIANBATDAU);
            const ngay = dateObj.toISOString().split('T')[0]; 
            const gio = dateObj.toISOString().split('T')[1].substring(0, 5);

            let ketQua = "Đang xử lý";
            if (slot.ghepcap.TRANGTHAI === 'x_c_nh_n') {
                ketQua = "Thành công";
            } else if (slot.ghepcap.TRANGTHAI === 'H_y') {
                ketQua = "Đã hủy";
            } else if (slot.ghepcap.TRANGTHAI === 'Ch__Duy_t') {
                ketQua = "Đang xử lý";
            }

            return {
                slot_id: slot.HOPID,
                mon: slot.ghepcap.dondangky.linhvuc.TENLINHVUC,
                ngay: ngay,
                gio: gio,
                ketQua: ketQua
            };
        });
    }

    async registerFields(userId, fieldIds) {

        console.log(fieldIds)
        // 1. Lấy TutorID
        const tutor = await prisma.tutor.findUnique({
            where: { USERID: userId },
            select: { TUTORID: true }
        });

        if (!tutor) throw new NotFoundError("Không tìm thấy Tutor");

        const tutorId = tutor.TUTORID;

        let listIds = [];

        if (Array.isArray(fieldIds)) {
            listIds = fieldIds
                .flat(Infinity) 
                .flatMap(item => (typeof item === 'string' ? item.split(',') : item)); // Tách chuỗi "1, 2" thành ["1", " 2"]
        } else if (typeof fieldIds === 'string') {
            listIds = fieldIds.split(',');
        }

        const parsedIds = listIds
            .map(id => parseInt(String(id).trim())) 
            .filter(id => !isNaN(id));

        console.log("List IDs sau khi flat:", parsedIds);

        // 2. Dùng transaction để xóa cũ -> thêm mới (cập nhật toàn bộ)
        await prisma.$transaction(async (tx) => {
            // Xóa các lĩnh vực cũ
            await tx.tutor_linhvuc.deleteMany({
                where: { TUTORID: tutorId }
            });

            if (fieldIds && fieldIds.length > 0) {
                const dataToInsert = parsedIds.map(fieldId => ({
                    TUTORID: tutorId,
                    LINHVUCID: parseInt(fieldId)
                }));

                console.log(dataToInsert)

                await tx.tutor_linhvuc.createMany({
                    data: dataToInsert
                });
            }
        });

        return { message: "Cập nhật lĩnh vực giảng dạy thành công" };
    }

async deletebooking(idBooking, userid) {
        //Lấy thông tin Tutor từ UserID
        const tutor = await prisma.tutor.findUnique({
            where: {
                USERID: parseInt(userid)
            },
            select: {
                TUTORID: true
            }
        });

        if (!tutor) {
            throw new BadRequestError("Tutor không hợp lệ");
        }

        const booking = await prisma.lichhop.findUnique({
            where: {
                HOPID: parseInt(idBooking)
            },
            include: {
                ghepcap: true 
            }
        });

        if (!booking) {
            throw new NotFoundError("Không tìm thấy buổi học này");
        }

        if (booking.ghepcap.TUTORID !== tutor.TUTORID) {
            throw new UnAuthorizedError("Bạn không có quyền xóa buổi học của người khác");
        }

        const result = await prisma.lichhop.delete({
            where: {
                HOPID: parseInt(idBooking)
            }
        });

        return result;
    }

}


export default new tutorService();