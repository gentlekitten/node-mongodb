const config = require("../config")

const mongoose = require("mongoose")
// 阻止mongoose警告
mongoose.set('strictQuery', true)

// 连接 mongodb数据库
mongoose.connect(config.db.url)

const db = mongoose.connection

db.on("error", err => {
    console.log("数据库连接失败", err)
})

db.on("open", () => {
    console.log("数据库连成功")
})
