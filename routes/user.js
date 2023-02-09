const { userValidator } = require("../model/user")
const validator = require("../middleware/validate")
const user = require("../controller/user")
const auth = require("../middleware/auth")
const checkUserExist = require("../middleware/checkUserExist")
const checkTopicExist = require("../middleware/checkTopicExist")
const checkAnswerExist = require("../middleware/checkAnswerExist")

const router = require("express").Router()

// 注册用户
router.post("/", validator(userValidator), user.register)

// 获取用户列表
router.get("/", user.getUserList)

// 获取指定用户
router.get("/:id", checkUserExist, user.getUserById)

// 编辑用户
router.patch("/:id", [auth, validator(userValidator)], user.updateUser)

// 删除用户
router.delete("/:id", [auth, validator(userValidator)], user.deleteUser)

// 获取关注列表
router.get("/following/:id", user.listFollowing)

// 关注
router.put("/follow/:id", [auth, checkUserExist], user.follow)

// 取消关注
router.delete("/unfollow/:id", [auth, checkUserExist], user.unFollow)

// 获取粉丝列表
router.get("/listFollowers/:id", user.listFollowers)

// 关注话题
router.put("/followTopic/:id", [auth, checkTopicExist], user.followTopic)

// 取消关注话题
router.delete("/unfollowTopic/:id", [auth, checkTopicExist], user.unfollowTopic)

// 获取话题粉丝列表
router.get("/topicListFollowers/:id", user.topicListFollowers)

// 获取用户关注话题列表
router.get("/getFollowingTopic/:id", user.getFollowingTopic)

// 喜欢答案
router.put("/likeAnswer/:id", [auth, checkAnswerExist], user.likeAnswer, user.undislikeAnswer)

// 取消喜欢
router.delete("/unlikeAnswer/:id", [auth, checkAnswerExist], user.unlikeAnswer)

// 喜欢列表
router.get('/getLikingAnswersList/:id', user.getLikingAnswersList);

// 不喜欢答案
router.put("/dislikeAnswer/:id", [auth, checkAnswerExist], user.dislikeAnswer, user.unlikeAnswer)

// 取消不喜欢
router.delete("/undislikeAnswer/:id", [auth, checkAnswerExist], user.undislikeAnswer)

// 不喜欢列表
router.get('/getDislikingAnswersList/:id', user.getDislikingAnswersList);

// 收藏
router.put("/collectingAnswer/:id", [auth, checkAnswerExist], user.collectingAnswer)

// 取消收藏
router.delete("/uncollectingAnswer/:id", [auth, checkAnswerExist], user.uncollectingAnswer)

// 收藏列表
router.get("/getCollectingAnswersList/:id", user.getCollectingAnswersList)

module.exports = router