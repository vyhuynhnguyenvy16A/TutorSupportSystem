import prisma from "../common/prisma/prisma.init.js";
import { BadRequestError, NotFoundError } from "../helpers/handleError.js";
import bcrypt from "bcrypt";
import { calculateCosineSimilarity } from "../helpers/textSimilarity.js";
import { ghepcap_TRANGTHAI, dondangky_TRANGTHAICHODUYET } from "@prisma/client";
const saltRounds = 10
class adminService{
    async getEvals(batchID){
        const existingBatch = await prisma.dotdangky.findUnique({
            where: {
                DOTID: parseInt(batchID)
            }
        })

        if (!existingBatch){
            throw new BadRequestError(
                "Không tồn tại đợt này"
            )
        }

        const evalList = await prisma.danhgia.findMany({
            where: {
                ghepcap: {
                    dondangky: {
                        DOTID: parseInt(batchID)
                    }
                }
            },

            select: {
                NGUOIDANGGIA: true,
                DIEMSO: true,
                NHANXET: true,
                ghepcap: {
                    select: {
                        TUTORID: true,
                        dondangky: true
                    }
                }
            }
        })

        if (!evalList || evalList.length == 0){
            throw new NotFoundError(
                "Không tìm thấy đánh giá nào trong đợt này"
            )
        }

        const soDanhGia = evalList.length;
        const tongDiem = evalList.reduce((sum, evalItem) => sum + evalItem.DIEMSO, 0);
        const diemTrungBinh = parseFloat((tongDiem / soDanhGia).toFixed(2));

        // Tìm người đánh giá và người được đánh giá
        const processedEvals = await Promise.all(evalList.map(async (evalItem) => {
            const commonData = {
                diemso: evalItem.DIEMSO,
                nhanxet: evalItem.NHANXET,
                role_nguoidanhgia: evalItem.NGUOIDANGGIA
            }

            const student = await prisma.student.findUnique({
                where: {
                    STUDENTID: evalItem.ghepcap.dondangky.STUDENTID
                },

                select: {
                    MSSV: true,
                    user: {
                        select: {
                            HOTEN: true
                        }
                    }
                }
            })

            const tutor = await prisma.tutor.findUnique({
                where: {
                    TUTORID: evalItem.ghepcap.TUTORID
                },

                select: {
                    BOMON: true,
                    user: {
                        select: {
                            HOTEN: true
                        }
                    }
                }
            })


            if (evalItem.NGUOIDANGGIA == "STUDENT"){
                return {
                    commonData: commonData,
                    nguoidanhgia: `STUDENT ${student.user.HOTEN} - MSSV: ${student.MSSV}`,
                    nguoiduocdanhgia: `Tutor ${tutor.user.HOTEN} thuộc bộ môn ${tutor.BOMON}`
                }
            }

            return {
                commonData: commonData,
                nguoidanhgia: `Tutor ${tutor.user.HOTEN} thuộc bộ môn ${tutor.BOMON}`,
                nguoiduocdanhgia: `STUDENT ${student.user.HOTEN} - MSSV: ${student.MSSV}`
            }
        }))

        return {
            evalList: processedEvals,
            soDanhGia: soDanhGia,
            diemTrungBinh: diemTrungBinh,
        }

    }

    async register(data){
        const { email, HoTen, password } = data;
        if (!email || !password || !HoTen){
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

        const existingEmail = await prisma.user.findFirst({
            where: {
                EMAIL: email
            }
        })

        if (existingEmail){
            throw new BadRequestError(
                "Email đã tồn tại trong hệ thống"
            )
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds)
        try{
            const newAdmin = await prisma.user.create({
                data: {
                    EMAIL: email,
                    Password: hashedPassword,
                    Role: "ADMIN",
                    HOTEN: HoTen
                },

                select: {
                    EMAIL: true,
                    Role: true
                }
            })

            return newAdmin
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

    async editPairing(ghepcapID, tutorID){
        const pairing = await prisma.ghepcap.findFirst({
            where: {
                GHEPCAPID: parseInt(ghepcapID)
            }
        })

        if (!pairing){
            throw new NotFoundError(
                "Không tìm thấy cặp này"
            )
        }

        const tutor = await prisma.tutor.findFirst({
            where: {
                TUTORID: parseInt(tutorID)
            }
        })

        if (!tutor){
            throw new NotFoundError(
                "Không tìm thấy tutor này"
            )
        }

        const updatedPairing = await prisma.ghepcap.update({
            where: {
                GHEPCAPID: parseInt(ghepcapID)
            },
            
            data: {
                TUTORID: parseInt(tutorID)
            },

            select: {
                TUTORID: true
            }
        })

        return {
            new_tutor_id: updatedPairing.TUTORID
        }
    }

    async approvePairing(ghepcapID) {
        const id = parseInt(ghepcapID);
        if (isNaN(id)) {
            throw new BadRequestError("GHEPCAPID không hợp lệ");
        }

        const pairing = await prisma.ghepcap.findUnique({
            where: { GHEPCAPID: id },
        });

        if (!pairing) {
            throw new NotFoundError("Không tìm thấy ghép cặp này");
        }

        // Sử dụng Enum object thay vì string cứng "Ch__Duy_t"
        if (pairing.TRANGTHAI !== ghepcap_TRANGTHAI.Ch__Duy_t) {
            throw new BadRequestError(
                "Chỉ có thể duyệt các ghép cặp đang ở trạng thái 'Chờ Duyệt'"
            );
        }

        const [updatedPairing, updatedRequest] = await prisma.$transaction([
            prisma.ghepcap.update({
                where: { GHEPCAPID: id },
                data: { 
                    // Sử dụng Enum: x_c_nh_n (tương ứng với Đã xác nhận)
                    TRANGTHAI: ghepcap_TRANGTHAI.x_c_nh_n 
                }, 
                select: {
                    GHEPCAPID: true,
                    DONID: true,
                    TUTORID: true,
                    TRANGTHAI: true,
                },
            }),
            prisma.dondangky.update({
                where: { DONID: pairing.DONID },
                data: { 
                    // Sử dụng Enum: Duy_t (tương ứng với Đã Duyệt)
                    TRANGTHAICHODUYET: dondangky_TRANGTHAICHODUYET.Duy_t 
                }, 
                select: {
                    DONID: true,
                    TRANGTHAICHODUYET: true,
                    STUDENTID: true,
                    LINHVUCID: true,
                },
            }),
        ]);

        return {
            pairing: updatedPairing,
            request: updatedRequest,
        };
    }

    async rejectPairing(ghepcapID) {
        const id = parseInt(ghepcapID);
        if (isNaN(id)) {
            throw new BadRequestError("GHEPCAPID không hợp lệ");
        }

        const pairing = await prisma.ghepcap.findUnique({
            where: { GHEPCAPID: id },
        });

        if (!pairing) {
            throw new NotFoundError("Không tìm thấy ghép cặp này");
        }

        // Sử dụng Enum object
        if (pairing.TRANGTHAI !== ghepcap_TRANGTHAI.x_c_nh_n) {
            throw new BadRequestError(
                "Chỉ có thể từ chối các ghép cặp đang ở trạng thái 'Đã xác nhận'"
            );
        }

        const [updatedPairing, updatedRequest] = await prisma.$transaction([
            prisma.ghepcap.update({
                where: { GHEPCAPID: id },
                data: { 
                    TRANGTHAI: ghepcap_TRANGTHAI.H_y 
                }, 
                select: {
                    GHEPCAPID: true,
                    DONID: true,
                    TUTORID: true,
                    TRANGTHAI: true,
                },
            }),
            prisma.dondangky.update({
                where: { DONID: pairing.DONID },
                data: { 
                    TRANGTHAICHODUYET: dondangky_TRANGTHAICHODUYET.T__Ch_i 
                }, 
                select: {
                    DONID: true,
                    TRANGTHAICHODUYET: true,
                    STUDENTID: true,
                    LINHVUCID: true,
                },
            }),
        ]);

        return {
            pairing: updatedPairing,
            request: updatedRequest,
        };
    }

    async updateTutorFields(tutorId, fieldIds) {
        // Kiểm tra tutor tồn tại
        const existingTutor = await prisma.tutor.findUnique({
            where: { TUTORID: parseInt(tutorId) }
        });

        if (!existingTutor) throw new NotFoundError("Tutor không tồn tại");

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

        // Transaction: Xóa cũ -> Thêm mới
        await prisma.$transaction(async (tx) => {
            await tx.tutor_linhvuc.deleteMany({
                where: { TUTORID: parseInt(tutorId) }
            });

            console.log(parsedIds)

            if (fieldIds && fieldIds.length > 0) {
                const dataToInsert = parsedIds.map(id => ({
                    TUTORID: parseInt(tutorId),
                    LINHVUCID: parseInt(id)
                }));

                console.log(dataToInsert)
                await tx.tutor_linhvuc.createMany({ data: dataToInsert });
            }
        });

        return { message: "Admin đã cập nhật lĩnh vực cho tutor thành công" };
    }

    // API 3: Chạy thuật toán ghép cặp tự động
    async runAIPairing(batchId) {
        // 1. Lấy danh sách đơn đăng ký CHƯA ĐƯỢC DUYỆT trong đợt này
        const applications = await prisma.dondangky.findMany({
            where: {
                DOTID: parseInt(batchId),
                // Chỉ lấy những đơn chưa có trong bảng ghepcap hoặc chưa được duyệt
                ghepcap: null 
            },
            include: {
                student: true, // Để lấy LICHRANH_TEXT của student
                linhvuc: true
            }
        });

        if (!applications.length) {
            throw new BadRequestError("Không có đơn đăng ký nào chưa được ghép trong đợt này.");
        }

        const matches = [];

        // 2. Lấy danh sách tất cả Tutor đang "Sẵn Sàng"
        // enum trong DB là "S_n_S_ng"
        const activeTutors = await prisma.tutor.findMany({
            where: { TRANGTHAITHAMGIA: "S_n_S_ng" },
            include: {
                tutor_linhvuc: true // Để biết tutor dạy môn nào
            }
        });

        // 3. Chạy thuật toán ghép cặp
        for (const app of applications) {
            const studentSchedule = app.student.LICHRANH_TEXT || "";
            const subjectId = app.LINHVUCID;

            // Lọc ra các tutor có dạy môn này
            const eligibleTutors = activeTutors.filter(t => 
                t.tutor_linhvuc.some(tl => tl.LINHVUCID === subjectId)
            );

            if (eligibleTutors.length === 0) {
                continue; // Không có tutor nào dạy môn này -> Bỏ qua
            }

            // Tính điểm tương đồng cho từng tutor
            let bestTutor = null;
            let maxScore = -1;

            for (const tutor of eligibleTutors) {
                const tutorSchedule = tutor.LICHRANH_TEXT || "";
                
                // Tính cosine similarity
                const score = calculateCosineSimilarity(studentSchedule, tutorSchedule);

                if (score > maxScore) {
                    maxScore = score;
                    bestTutor = tutor;
                }
            }

            // Nếu tìm được ứng viên (dù điểm thấp vẫn ghép, hoặc có thể đặt ngưỡng threshold > 0.1)
            if (bestTutor) {
                matches.push({
                    DONID: app.DONID,
                    TUTORID: bestTutor.TUTORID,
                    TRANGTHAI: "Ch__Duy_t", // Default chờ admin duyệt lại
                    SCORE: maxScore // Lưu chơi để debug nếu cần
                });
            }
        }

        // 4. Lưu vào Database (Bảng ghepcap)
        if (matches.length > 0) {
            await prisma.ghepcap.createMany({
                data: matches.map(m => ({
                    DONID: m.DONID,
                    TUTORID: m.TUTORID,
                    TRANGTHAI: m.TRANGTHAI
                }))
            });
        }

        return {
            totalProcessed: applications.length,
            totalPaired: matches.length,
            details: matches
        };
    }

    

    async getPairings(batchID) {
        const pairings = await prisma.ghepcap.findMany({
            where: {
                dondangky: {
                    DOTID: parseInt(batchID)
                },
            },

            include: {
                dondangky: {
                    include: {
                        linhvuc: true,
                        student: {
                            include: {
                                user: true
                            }
                        }
                    }
                },
                tutor: {
                    include: {
                        user: true
                    }
                }
            }
        });

        const statusMap = {
            "Ch__Duy_t": "Chờ Duyệt",
            "x_c_nh_n": "Đã xác nhận",
            "H_y": "Đã Hủy"
        };

        // 3. Map lại dữ liệu trước khi trả về
        const formattedPairings = pairings.map(pairing => {
            return {
                ...pairing,
                TRANGTHAI: statusMap[pairing.TRANGTHAI] || pairing.TRANGTHAI 
            };
        });

        return formattedPairings;
    }

    async getApplyForm(batchID){
        const forms = await prisma.dondangky.findMany({
            where: {
                DOTID: parseInt(batchID),
                ghepcap: null
            },

            include: {
                student: {
                    select: {
                        MSSV: true,
                        user: { select: { HOTEN: true } }
                    }
                },
                linhvuc: {
                    select: { TENLINHVUC: true }
                }
            }
        })

        return forms
    }
}

export default new adminService();