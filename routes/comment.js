const { commentValidator } = require("../model/comment")
const validator = require("../middleware/validate")
const comment = require("../controller/comment")
const checkCommentExist = require("../middleware/checkCommentExist")
const checkCommentator = require("../middleware/checkCommentator")
const auth = require("../middleware/auth")

const router = require("express").Router()

// 获取评论列表
router.get("/", comment.getCommentList)

// 获取指定评论
router.get("/:id", comment.getComment)

// 创建评论
router.post("/", [auth, validator(commentValidator)], comment.createComment)

// 修改评论
router.patch("/:id", [auth, validator(commentValidator), checkCommentExist, checkCommentator], comment.updateComment)

// 删除评论
router.delete("/:id", [auth, checkCommentExist, checkCommentator], comment.deleteComment)

module.exports = router