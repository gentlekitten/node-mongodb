const { Comment } = require("../model/comment")

// 获取评论列表
exports.getCommentList = async (req, res, next) => {
    try {
        let {
            pageTotal = 10,
            pageIndex = 1,
            keyword = "",
            rootCommentId } = req.query
        const { questionId, answerId } = req.params
        // 每页有几项
        pageTotal = Math.max(pageTotal * 1, 1)
        // 当前是第几页
        pageIndex = Math.max(pageIndex * 1, 1) - 1
        // limit()显示多少数据，skip()跳过多少数据
        // { content: new RegExp(keyword) } 模糊查询
        const commentList = await Comment.find({
            content: new RegExp(keyword),
            questionId,
            answerId,
            rootCommentId
        })
            .limit(pageTotal)
            .skip(pageIndex * pageTotal)
            .populate("commentator replyTo")
        if (!commentList) return res.status(400).json({
            code: 400,
            msg: "获取评论列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取评论列表成功！",
            data: commentList
        })
    } catch (error) {
        next(error)
    }
}

// 获取指定评论
exports.getComment = async (req, res, next) => {
    try {
        const id = req.params.id
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join("")
        let comment = null
        try {
            comment = await Comment.findById(id).select(selectFields).populate("commentator")
        } catch (error) {
            return res.status(400).json({
                code: 400,
                msg: "获取评论失败！",
                data: comment
            })
        }
        if (!comment) return res.status(400).json({
            code: 400,
            msg: "获取评论失败！",
            data: comment
        })
        res.status(200).json({
            code: 200,
            msg: "获取评论成功！",
            data: comment
        })
    } catch (error) {
        next(error)
    }
}

// 创建评论
exports.createComment = async (req, res, next) => {
    try {
        const { questionId, answerId } = req.params
        comment = new Comment({
            ...req.body,
            questionId,
            answerId,
            commentator: req.userData._id
        })
        await comment.save()
        res.status(200).json({
            code: 200,
            msg: "评论成功！"
        })
    } catch (error) {
        next(error)
    }
}

// 修改评论
exports.updateComment = async (req, res, next) => {
    try {
        const { content } = req.body
        const commentId = req.params.id
        let comment = await Comment.findByIdAndUpdate(commentId, { content })
        if (!comment) return res.status(400).json({
            code: 400,
            msg: "更新评论失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "更新评论成功！",
            data: content
        })
    } catch (error) {
        next(error)
    }
}

// 删除评论
exports.deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id
        const data = await Comment.findByIdAndDelete(commentId)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "删除失败！",
            data: { id: commentId }
        })
        res.status(200).json({
            code: 200,
            msg: "删除成功！",
            data
        })
    } catch (error) {
        next(error)
    }
}