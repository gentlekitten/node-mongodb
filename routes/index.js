const router = require("express").Router()

// 用户接口
router.use("/user", require("./user"))

// 登录接口
router.use("/auth", require("./auth"))

// 文件上传接口
router.use("/upload", require("./upload"))

// 话题接口
router.use("/topic", require("./topic"))

// 问题接口
router.use("/question", require("./question"))

// 答案接口
router.use("/questions/:questionId/answers", require("./answer"))

// 评论接口
router.use("/questions/:questionId/answers/:answerId/comment", require("./comment"))

// 分类接口
router.use("/category", require("./category"))

// 文章接口
router.use("/article", require("./article"))

module.exports = router