// 接口授权中间件
const jwt = require("jsonwebtoken")
const config = require("../config")

module.exports = function (req, res, next) {
    // 前端请求头中包含有效的authorization
    const token = req.header("authorization")

    if (!token) return res.status(401).json({
        code: 401,
        msg: "Unauthorization 无 Token"
    })
    try {
        // 存在token时，验证是否有效
        const userData = jwt.verify(token, config.secret)
        // 得到了token中存储的数据（用户信息），保存供后继续操作
        // { _id: '63da2e72bd76f753e4e85c6f', iat: 1675243185, exp: 1676107185 } 
        req.userData = userData
        next()
    } catch (error) {
        return res.status(401).json({
            code: 401,
            msg: "Unauthorization Token 无效"
        })
    }
}