import prisma from "../common/prisma/prisma.init.js";
import { NotFoundError } from "../helpers/handleError.js";

class publicService{
    async getFields(){
        const fieldList = await prisma.linhvuc.findMany();
        
        if (!fieldList || fieldList.length == 0){
            throw new NotFoundError("Không tìm thấy lĩnh vực nào")
        }

        return {fieldList}
    }

    async getPairingBatches(){
        const batches = await prisma.dotdangky.findMany({
            select: {
                DOTID: true,
                TENDOT: true,
                NGAYBATDAU: true,
                NGAYKETTHUC: true,
                TRANGTHAI: true,
            }
        })

        return batches
    }
}

export default new publicService();