// 检查是否有权限中间件
const { Question } = require("../model/question")

module.exports = async (req, res, next) => {
    let question = null
    /* 这里的findById存在一个问题：
       当参数id长度不为12个字节或者不为24个字符的时候会报错
       所以还要加一层try catch
       */
    try {
        question = await Question.findById(req.params.id).select('+questioner')
    } catch (error) {
        return res.status(400).json({
            code: 400,
            msg: "没有权限"
        })
    }
    if (question.questioner.toString() !== req.userData._id) return res.status(400).json({
        code: 400,
        msg: "没有权限"
    })
    next()
}