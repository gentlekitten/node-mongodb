module.exports = {
    // 项目配置
    app: {
        port: process.env.PORT || 3000
    },
    // 数据库的配置
    db: {
        url: process.env.MONGOOB_URL || "mongodb://localhost:27017/node_template"
    },
    // jwt秘钥
    secret: "43789DF5-82F7-C3D0-1E94-12DE12A5BDA0"
}