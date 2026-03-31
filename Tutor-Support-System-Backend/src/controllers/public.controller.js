import { handleSuccessResponse } from "../helpers/handleResponse.js";
import publicService from "../services/public.service.js";

class publicController{
    /**
     * @swagger
     * /public/fields:
     *   get:
     *     summary: Lấy danh sách lĩnh vực hỗ trợ của chương trình
     *     tags: [Public]
     *     responses:
     *       200:
     *         description: Lấy danh sách lĩnh vực thành công
     *       404:
     *         description: Không tìm thấy lĩnh vực nào
     *       500:
     *         description: Lỗi hệ thống
     */
    async getFields(req, res, next){
        try{
            const result = await publicService.getFields();
            const response = handleSuccessResponse(200, "Lấy danh sách lĩnh vực thành công", result)

            res.status(200).json(response)
        } catch(error){
            next(error)
        }
    }

    /**
     * @swagger
     * /public/pairing-batches:
     *   get:
     *     summary: Lấy danh sách các đợt đăng ký của chương trình
     *     tags: [Public]
     *     responses:
     *       200:
     *         description: Lấy danh sách lĩnh vực thành công
     *       404:
     *         description: Không tìm thấy lĩnh vực nào
     *       500:
     *         description: Lỗi hệ thống
     */

    async getPairingBatches(req, res, next){
        try{
            const result = await publicService.getPairingBatches();
            const response = handleSuccessResponse(200, "Lấy đợt đăng ký thành công", result)

            res.status(200).json(response)
        } catch(error){
            next(error);
        }
    }

}

export default new publicController();