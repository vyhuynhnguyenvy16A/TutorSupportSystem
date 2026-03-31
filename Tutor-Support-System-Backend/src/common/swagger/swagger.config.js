import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Tutor Support System API",
        version: "1.0",
        description: "Quản lý Hệ thống hỗ trợ TUTOR (CNPM - 251)"
    },

    servers: [
        {
            url: "http://localhost:3069",
        }
    ],

    tags: [
        {
            name: "Đăng ký chương trình",
            description: "Các APIs cho chương trình",
        },

        {
            name: "Auth",
            description: "Các APIs cho Authentication",
        },

        {
            name: "Tutor",
            description: "Các APIs cho tutor",
        },

        {
            name: "Lịch họp",
            description: "Các APIs lịch họp",
        },

        {
            name: "Ghép cặp",
            description: "Các APIs cho ghép cặp",
        },

        {
            name: "Báo cáo",
            description: "Các APIs cho báo cáo"
        }

    ],

    "components": {
        "securitySchemes": {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
        }
    }


}

const options = {
    definition: swaggerDefinition,
    apis: ["../../routers/*.js", "./src/controllers/*.js"] // which contain Swagger comment
}

const swaggerSpec = swaggerJSDoc(options)

export function setupSwagger(app){
    app.use("/swagger/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}