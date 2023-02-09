const { answerValidator } = require("../model/answer")
const validator = require("../middleware/validate")
const answer = require("../controller/answer")
const auth = require("../middleware/auth")
const checkAnswerExist = require("../middleware/checkAnswerExist")
const checkAnswerer = require("../middleware/checkAnswerer")

const router = require("express").Router()

// 获取答案列表
router.get("/", answer.getAnswerlist)

// 获取指定答案
router.get("/:id", answer.getAnswer)

// 创建答案
router.post("/", [auth, validator(answerValidator)], answer.createAnswer)

// 修改答案
router.patch("/:id", [auth, validator(answerValidator), checkAnswerExist, checkAnswerer], answer.updateAnswer)

// 删除答案
router.delete("/:id", [auth, checkAnswerExist, checkAnswerer], answer.deleteAnswer)

module.exports = router