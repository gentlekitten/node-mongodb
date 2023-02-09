const { questionValidator } = require("../model/question")
const validator = require("../middleware/validate")
const question = require("../controller/question")
const checkQuestionExist = require("../middleware/checkQuestionsExist")
const checkQuestioner = require("../middleware/checkQuestioner")
const checkTopicExist = require("../middleware/checkTopicExist")
const auth = require("../middleware/auth")

const router = require("express").Router()

// 获取问题列表
router.get("/", question.getQuestionlist)

// 获取指定问题
router.get("/:id", question.getQuestion)

// 查询用户问题列表
router.get("/questioner/:id", question.getQuestionerlist)

// 查询话题的问题列表
router.get("/getTopicQuestionList/:id", checkTopicExist, question.getTopicQuestionList)

// 创建问题
router.post("/", [auth, validator(questionValidator)], question.createQuestion)

// 修改问题
router.patch("/:id", [auth, validator(questionValidator), checkQuestionExist, checkQuestioner], question.updateQuestion)

// 删除问题
router.delete("/:id", checkQuestionExist, question.deleteQuestion)

module.exports = router