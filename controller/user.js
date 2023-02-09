const bcrypt = require("bcrypt")
const { Answer } = require("../model/answer")
const { User } = require("../model/user")

// 注册
exports.register = async (req, res, next) => {
    try {
        console.log('req.validValue', req.validValue)
        let { email, username, password } = req.validValue
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                code: 400,
                msg: "用户已注册！",
                data: { email }
            })
        }
        // 密码加密
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)

        user = new User({
            email,
            password,
            username
        })
        user.save()

        res.status(200).json({
            code: 200,
            msg: "注册成功！",
            data: { email }
        })
    } catch (error) {
        // 出错了会执行错误处理中间件
        next(error)
    }
}

// 获取用户列表
exports.getUserList = async (req, res, next) => {
    try {
        const userList = await User.find()
        if (!userList) return res.status(400).json({
            code: 400,
            msg: "用户列表不存在！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取成功",
            data: { userList }
        })
    } catch (error) {
        next(error)
    }
}

// 获取指定用户
exports.getUserById = async (req, res, next) => {
    try {
        // 获取fields字段
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f)
            .map(f => " +" + f).join("")
        const userId = req.params.id
        const populateStr = fields.split(";").filter(f => f)
            .map(f => {
                if (f === "employments") return "employments.company employments.job"
                if (f === "educations") return "educations.school educations.major"
                return f
            }
            ).join(" ")
        // 在路由已经使用检查用户存在中间件判断用户是否存在
        const user = await User.findById(userId).select(selectFields).populate(populateStr)
        res.status(200).json({
            code: 200,
            msg: "查询成功！",
            data: { user }
        })
    } catch (error) {
        next(error)
    }
}

// 编辑/修改用户
exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const body = req.body
        const salt = await bcrypt.genSalt(10)
        body.password = await bcrypt.hash(body.password, salt)

        const data = await User.findByIdAndUpdate(userId, body)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "更新失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "更新成功！",
            data: body
        })
    } catch (error) {
        next(error)
    }
}

// 删除用户
exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const data = await User.findByIdAndDelete(userId)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "删除失败！",
            data: { id: userId }
        })
        res.status(200).json({
            code: 200,
            msg: "删除成功！",
            data: req.body
        })
    } catch (error) {
        next(error)
    }
}

// 获取关注列表
exports.listFollowing = async (req, res, next) => {
    try {
        let userId = req.params.id
        const user = await User.findById(userId).select("+following").populate("following")
        if (!user) return res.status(400).json({
            code: 400,
            msg: "获取关注列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取关注列表成功！",
            data: user
        })
    } catch (error) {
        next(error)
    }
}

// 关注
exports.follow = async (req, res, next) => {
    try {
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+following")
        // 判断是否已经关注
        if (user.following.map(id => id.toString()).includes(req.params.id)) return res.status(400).json({
            code: 400,
            msg: "已关注，关注失败！"
        })
        user.following.push(req.params.id)
        await user.save()
        res.status(200).json({
            code: 200,
            msg: "关注成功！",
            data: user
        })
    } catch (error) {
        next(error)
    }
}

// 取消关注
exports.unFollow = async (req, res, next) => {
    try {
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+following")
        // 获取所关注用户的索引
        const index = user.following.map(id => id.toString()).indexOf(req.params.id)
        // 判断是否已经关注
        if (index === -1) return res.status(400).json({
            code: 400,
            msg: "未关注，取消关注失败！"
        })
        user.following.splice(index, 1)
        await user.save()
        res.status(200).json({
            code: 200,
            msg: "取消关注成功！",
            data: user
        })
    } catch (error) {
        next(error)
    }
}

// 获取粉丝关注列表
exports.listFollowers = async (req, res, next) => {
    try {
        const users = await User.find({ following: req.params.id })
        // 判断是否已经关注
        if (!users) return res.status(400).json({
            code: 400,
            msg: "查询粉丝列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "查询粉丝列表成功！",
            data: users
        })
    } catch (error) {
        next(error)
    }
}

// 关注话题
exports.followTopic = async (req, res, next) => {
    try {
        const userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+followingTopic")
        // 判断是否已经关注
        if (user.followingTopic.map(f => f.toString()).includes(req.params.id)) return res.status(400).json({
            code: 400,
            msg: "已关注，关注失败！"
        })
        user.followingTopic.push(req.params.id)
        await user.save()
        res.status(200).json({
            code: 200,
            msg: "关注成功！",
            data: user
        })
    } catch (error) {
        next(error)
    }
}

// 取消关注话题
exports.unfollowTopic = async (req, res, next) => {
    try {
        const userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+followingTopic")
        const index = user.followingTopic.map(f => f.toString()).indexOf(req.params.id)
        // 判断是否已经关注
        if (index === -1) return res.status(400).json({
            code: 400,
            msg: "未关注，取消关注失败！"
        })
        user.followingTopic.splice(index, 1)
        await user.save()
        res.status(200).json({
            code: 200,
            msg: "关取消注成功！",
            data: user
        })
    } catch (error) {
        next(error)
    }
}

// 获取用户关注的话题
exports.getFollowingTopic = async (req, res, next) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId).select("+followingTopic").populate("followingTopic")
        // 判断是否已经关注
        if (!user) return res.status(400).json({
            code: 400,
            msg: "查询失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取成功！",
            data: user
        })
    } catch (error) {
        next(error)
    }
}

// 获取话题粉丝列表
exports.topicListFollowers = async (req, res, next) => {
    try {
        const users = await User.find({ followingTopic: req.params.id })
        // 判断是否已经关注
        if (!users) return res.status(400).json({
            code: 400,
            msg: "查询粉丝列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "查询粉丝列表成功！",
            data: users
        })
    } catch (error) {
        next(error)
    }
}

/**
 * 赞的
 */
// 喜欢答案
exports.likeAnswer = async (req, res, next) => {
    try {
        const userId = req.userData._id
        const answerId = req.params.id
        const user = await User.findById(userId.toString()).select("+likingAnswers")
        // 判断是否赞
        console.log('user', user.likingAnswers)
        if (!user.likingAnswers.map(id => id.toString())
            .includes(answerId)) {
            user.likingAnswers.push(answerId)
            await user.save()
            // 让问题的点赞数加一，$inc是正数每次增加，负数每次减少
            await Answer.findByIdAndUpdate(answerId, { $inc: { voteCount: 1 } })
        }
        // 走到这里要执行取消不喜欢
        await next()
    } catch (error) {
        next(error)
    }
}

// 取消喜欢答案
exports.unlikeAnswer = async (req, res, next) => {
    try {
        const userId = req.userData._id
        const answerId = req.params.id
        const user = await User.findById(userId.toString()).select("+likingAnswers")
        const index = user.likingAnswers.map(id => id.toString())
            .indexOf(answerId)
        if (index > -1) {
            user.likingAnswers.splice(index, 1)
            await user.save()
            await Answer.findByIdAndUpdate(answerId, { $inc: { voteCount: -1 } })
        }
        res.status(200).json({
            code: 200,
            msg: "成功！"
        })
    } catch (error) {
        next(error)
    }
}

// 获取喜欢的答案列表
exports.getLikingAnswersList = async (req, res, next) => {
    try {
        const userId = req.params.id
        let user = null
        try {
            user = await User.findById(userId).select("+likingAnswers").populate("likingAnswers")
            if (!user) return res.status(400).json({
                code: 400,
                msg: "操作失败！"
            })
            res.status(200).json({
                code: 400,
                msg: "获取成功！",
                data: user
            })
        } catch (error) {
            return res.status(400).json({
                code: 400,
                msg: "操作失败！"
            })
        }
    } catch (error) {
        next(error)
    }
}

/**
 * 踩的
 */
// 不喜欢答案
exports.dislikeAnswer = async (req, res, next) => {
    try {
        const userId = req.userData._id
        const answerId = req.params.id
        const user = await User.findById(userId.toString()).select("+dislikingAnswers")
        // 判断是否赞
        if (!user.dislikingAnswers.map(id => id.toString())
            .includes(answerId)) {
            user.dislikingAnswers.push(answerId)
            await user.save()
            await Answer.findByIdAndUpdate(answerId, { $inc: { voteCount: 1 } })
        }
        // 走到这里要执行取消赞
        await next()
    } catch (error) {
        next(error)
    }
}

// 取消不喜欢答案
exports.undislikeAnswer = async (req, res, next) => {
    try {
        const userId = req.userData._id
        const answerId = req.params.id
        const user = await User.findById(userId.toString()).select("+dislikingAnswers")
        const index = user.dislikingAnswers.map(id => id.toString())
            .indexOf(answerId)
        if (index > -1) {
            user.dislikingAnswers.splice(index, 1);
            await user.save()
            await Answer.findByIdAndUpdate(answerId, { $inc: { voteCount: -1 } })
        }
        res.status(200).json({
            code: 200,
            msg: "成功！"
        })
    } catch (error) {
        next(error)
    }
}

// 获取不喜欢的答案列表
exports.getDislikingAnswersList = async (req, res, next) => {
    try {
        const userId = req.params.id
        let user = null
        try {
            user = await User.findById(userId).select("+dislikingAnswers").populate("dislikingAnswers")
            if (!user) return res.status(400).json({
                code: 400,
                msg: "操作失败！"
            })
        } catch (error) {
            return res.status(400).json({
                code: 400,
                msg: "操作失败！"
            })
        }
        res.status(200).json({
            code: 400,
            msg: "获取成功！",
            data: user
        })
    } catch (error) {
        next(error)
    }
}

// 收藏答案
exports.collectingAnswer = async (req, res, next) => {
    try {
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+collectingAnswers")
        // 如果已经关注过了就直接return
        if (user.collectingAnswers.map(id => id.toString()).includes(req.params.id)) return res.status(400).json({
            code: 400,
            msg: "已收藏,收藏失败"
        })
        // 成功
        user.collectingAnswers.push(req.params.id)
        await user.save()
        res.status(200).json({
            code: 200,
            msg: "收藏成功",
            data: user
        })
    } catch (err) {
        next(err)
    }
}

// 取消收藏
exports.uncollectingAnswer = async (req, res, next) => {
    try {
        let userId = req.userData._id
        const user = await User.findById(userId.toString()).select("+collectingAnswers")
        const index = user.collectingAnswers.map(id => id.toString()).indexOf(req.params.id)
        if (index == -1) return res.status(400).json({
            code: 400,
            msg: "未收藏,取消收藏失败"
        })
        // 若已经关注，则取消
        user.collectingAnswers.splice(index, 1);
        await user.save()
        res.status(200).json({
            code: 200,
            msg: "取消收藏成功",
            data: user
        })
    } catch (err) {
        next(err)
    }
}

// 收藏列表
exports.getCollectingAnswersList = async (req, res, next) => {
    try {
        let userId = req.params.id;
        let user = null
        try {
            user = await User.findById(userId).select("+collectingAnswers").populate("collectingAnswers")
        } catch (error) {
            return res.status(400).json({
                code: 400,
                msg: "操作失败"
            })
        }
        // 未找到
        if (!user) return res.status(400).json({
            code: 400,
            msg: "操作失败"
        })
        // 获取成功
        res.status(200).json({
            code: 200,
            msg: "操作成功",
            data: user
        })
    } catch (err) {
        next(err)
    }
};
