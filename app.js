// 引入配置文件
const config = require("./config")

const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
require("./model")

const app = express()

// 处理json数据
app.use(express.json())
// 处理跨域
app.use(cors())
// 处理日志
app.use(morgan("dev"))
// 托管静态资源
app.use(express.static("public"))
// 引入数据库
require("./model")
// 引入路由中间件
app.use("/api", require("./routes"))
// 引入错误处理中间件,该中间件必须放在路由中间件的下面
app.use(require("./middleware/error"))

app.listen(3000, () => {
    console.log(`Running at http://localhost:${config.app.port}`)
})