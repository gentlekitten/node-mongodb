const { Question } = require("../model/question")

// 获取问题列表
exports.getQuestionlist = async (req, res, next) => {
    try {
        let { pageTotal = 10, pageIndex = 1, keyword = "" } = req.query
        // 每页有几项
        pageTotal = Math.max(pageTotal * 1, 1)
        // 当前是第几页
        pageIndex = Math.max(pageIndex * 1, 1) - 1
        // limit()显示多少数据，skip()跳过多少数据
        // { name: new RegExp(keyword) } 模糊查询
        const questionList = await Question.find({ description: new RegExp(keyword) })
            .limit(pageTotal)
            .skip(pageIndex * pageTotal)
        if (!questionList) return res.status(400).json({
            code: 400,
            msg: "获取问题列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取问题列表成功！",
            data: questionList
        })
    } catch (error) {
        next(error)
    }
}

// 获取指定问题
exports.getQuestion = async (req, res, next) => {
    try {
        const id = req.params.id
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join("")
        let question = null
        try {
            question = await Question.findById(id).select(selectFields).populate("questioner topics")
        } catch (error) {
            return res.status(400).json({
                code: 400,
                msg: "获取问题失败！",
                data: question
            })
        }
        if (!question) return res.status(400).json({
            code: 400,
            msg: "获取问题失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取问题成功！",
            data: question
        })
    } catch (error) {
        next(error)
    }
}

// 创建问题
exports.createQuestion = async (req, res, next) => {
    try {
        const data = req.body
        let question = await Question({ ...data, questioner: req.userData._id })
        await question.save()
        res.status(200).json({
            code: 200,
            msg: "问题添加成功！",
            data: question
        })
    } catch (error) {
        next(error)
    }
}

// 修改问题
exports.updateQuestion = async (req, res, next) => {
    try {
        const data = req.body
        const id = req.params.id
        let question = await Question.findByIdAndUpdate(id, data)
        if (!question) return res.status(400).json({
            code: 400,
            msg: "更新问题失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "更新问题成功！",
            data
        })
    } catch (error) {
        next(error)
    }
}

// 删除问题
exports.deleteQuestion = async (req, res, next) => {
    try {
        const id = req.params.id
        let question = await Question.findByIdAndDelete(id)
        if (!question) return res.status(400).json({
            code: 400,
            msg: "删除问题失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "删除问题成功！",
            data: question
        })
    } catch (error) {
        next(error)
    }
}

// 获取用户问题列表
exports.getQuestionerlist = async (req, res, next) => {
    try {
        const questionList = await Question.find({ questioner: req.params.id })
        if (!questionList) return res.status(400).json({
            code: 400,
            msg: "问题列表查找失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "问题列表查找成功！",
            data: questionList
        })
    } catch (error) {
        next(error)
    }
}

// 获取话题的问题列表
exports.getTopicQuestionList = async (req, res, next) => {
    try {
        const question = await Question.find({ topics: req.params.id })

        if (!question) return res.status(400).json({
            code: 400,
            msg: "获取问题列表失败！",
            data: question
        })
        res.status(200).json({
            code: 200,
            msg: "获取问题列表成功！",
            data: topic
        })
    } catch (error) {
        next(error)
    }
}
