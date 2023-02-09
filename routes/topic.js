const { topicValidator } = require("../model/topic")
const validator = require("../middleware/validate")
const topic = require("../controller/topic")

const router = require("express").Router()

// 获取话题列表
router.get("/", topic.getTopiclist)

// 获取指定话题
router.get("/:id", topic.getTopic)

// 创建话题
router.post("/", validator(topicValidator), topic.createTopic)

// 更新话题
router.patch("/:id", validator(topicValidator), topic.updateTopic)

module.exports = router