// 检查是否有权限中间件
const { Answer } = require("../model/answer")

module.exports = async (req, res, next) => {
    let answer = null
    /* 这里的findById存在一个问题：
       当参数id长度不为12个字节或者不为24个字符的时候会报错
       所以还要加一层try catch
       */
    try {
        answer = await Answer.findById(req.params.id).select('+answerer')
    } catch (error) {
        return res.status(400).json({
            code: 400,
            msg: "没有权限"
        })
    }
    if (answer.answerer.toString() !== req.userData._id) return res.status(400).json({
        code: 400,
        msg: "没有权限"
    })
    next()
}