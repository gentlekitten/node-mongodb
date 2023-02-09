// 检查用户是否存在中间件
const { User } = require("../model/user")

module.exports = async (req, res, next) => {
    let user = null
    /* 这里的findById存在一个问题：
       当参数id长度不为12个字节或者不为24个字符的时候会报错
       所以还要加一层try catch
       */
    try {
        user = await User.findById(req.params.id)
    } catch (error) {
        return res.status(404).json({
            code: 404,
            msg: "用户不存在"
        })
    }
    if (!user) return res.status(404).json({
        code: 404,
        msg: "用户不存在"
    })
    next()
}