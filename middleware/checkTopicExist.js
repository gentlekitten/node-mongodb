// 检查话题是否存在中间件
const { Topic } = require("../model/topic")

module.exports = async (req, res, next) => {
    let topic = null
    /* 这里的findById存在一个问题：
       当参数id长度不为12个字节或者不为24个字符的时候会报错
       所以还要加一层try catch
       */
    try {
        topic = await Topic.findById(req.params.id)
    } catch (error) {
        return res.status(404).json({
            code: 404,
            msg: "话题不存在"
        })
    }
    if (!topic) return res.status(404).json({
        code: 404,
        msg: "话题不存在"
    })
    next()
}