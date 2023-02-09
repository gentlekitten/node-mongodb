// 检查评论是否存在中间件
const { Comment } = require("../model/comment")

module.exports = async (req, res, next) => {
    let comment = null
    /* 这里的findById存在一个问题：
       当参数id长度不为12个字节或者不为24个字符的时候会报错
       所以还要加一层try catch
       */
    try {
        comment = await Comment.findById(req.params.id)
    } catch (error) {
        return res.status(404).json({
            code: 404,
            msg: "评论不存在"
        })
    }
    if (!comment) return res.status(404).json({
        code: 404,
        msg: "评论不存在"
    })
    if (req.params.questionId && comment.questionId !== req.params.questionId) {
        return res.status(404).json({
            code: 404,
            msg: "该问题下没有此评论"
        })
    }
    if (req.params.answerId && comment.answerId !== req.params.answerId) {
        return res.status(404).json({
            code: 404,
            msg: "该答案下没有此评论"
        })
    }
    next()
}