// 检查问题是否存在中间件
const { Question } = require("../model/question")

module.exports = async (req, res, next) => {
    let question = null
    /* 这里的findById存在一个问题：
       当参数id长度不为12个字节或者不为24个字符的时候会报错
       所以还要加一层try catch
       */
    try {
        question = await Question.findById(req.params.id)
    } catch (error) {
        return res.status(404).json({
            code: 404,
            msg: "问题不存在"
        })
    }
    if (!question) return res.status(404).json({
        code: 404,
        msg: "问题不存在"
    })
    next()
}