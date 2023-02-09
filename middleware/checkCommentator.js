// 检查是否有权限中间件
const { Comment } = require("../model/comment")

module.exports = async (req, res, next) => {
    let comment = null
    /* 这里的findById存在一个问题：
       当参数id长度不为12个字节或者不为24个字符的时候会报错
       所以还要加一层try catch
       */
    try {
        comment = await Comment.findById(req.params.id).select('+commentator')
    } catch (error) {
        return res.status(400).json({
            code: 400,
            msg: "没有权限"
        })
    }
    if (comment.commentator.toString() !== req.userData._id) return res.status(400).json({
        code: 400,
        msg: "没有权限"
    })
    next()
}