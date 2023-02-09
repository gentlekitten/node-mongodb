// 检查答案是否存在中间件
const { Answer } = require("../model/answer")

module.exports = async (req, res, next) => {
    let answer = null
    /* 这里的findById存在一个问题：
       当参数id长度不为12个字节或者不为24个字符的时候会报错
       所以还要加一层try catch
       */
    try {
        answer = await Answer.findById(req.params.id)
    } catch (error) {
        return res.status(404).json({
            code: 404,
            msg: "答案不存在"
        })
    }
    if (!answer) return res.status(404).json({
        code: 404,
        msg: "答案不存在"
    })
    // 根据答案id查询出来的答案可能并不是该问题下的答案
    if (answer.questionId !== req.params.questionId) {
        return res.status(404).json({
            code: 404,
            msg: "该问题下没有此答案"
        })
    }
    next()
}