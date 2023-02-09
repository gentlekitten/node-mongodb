const { Answer } = require("../model/answer")

// 获取答案列表
exports.getAnswerlist = async (req, res, next) => {
    try {
        let { pageTotal = 10, pageIndex = 1, keyword = "" } = req.query
        // 每页有几项
        pageTotal = Math.max(pageTotal * 1, 1)
        // 当前是第几页
        pageIndex = Math.max(pageIndex * 1, 1) - 1
        // limit()显示多少数据，skip()跳过多少数据
        // { name: new RegExp(keyword) } 模糊查询
        const answerList = await Answer.find({
            content: new RegExp(keyword),
            questionId: req.params.questionId
        })
            .limit(pageTotal)
            .skip(pageIndex * pageTotal)
        if (!answerList) return res.status(400).json({
            code: 400,
            msg: "获取答案列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取答案列表成功！",
            data: answerList
        })
    } catch (error) {
        next(error)
    }
}

// 获取指定答案
exports.getAnswer = async (req, res, next) => {
    try {
        const id = req.params.id
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join("")
        let answer = null
        try {
            answer = await Answer.findById(id).select(selectFields).populate("answerer")
        } catch (error) {
            console.log('error', error)
            return res.status(400).json({
                code: 400,
                msg: "获取答案失败！"
            })
        }
        if (!answer) return res.status(400).json({
            code: 400,
            msg: "获取答案失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取答案成功！",
            data: answer
        })
    } catch (error) {
        next(error)
    }
}

// 创建答案
exports.createAnswer = async (req, res, next) => {
    try {
        const data = req.body
        let answer = await Answer({
            ...data,
            answerer: req.userData._id,
            questionId: req.params.questionId
        })
        await answer.save()
        res.status(200).json({
            code: 200,
            msg: "答案添加成功！",
            data: answer
        })
    } catch (error) {
        next(error)
    }
}

// 修改答案
exports.updateAnswer = async (req, res, next) => {
    try {
        const data = req.body
        const id = req.params.id
        let answer = await Answer.findByIdAndUpdate(id, data)
        if (!answer) return res.status(400).json({
            code: 400,
            msg: "更新答案失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "更新答案成功！",
            data
        })
    } catch (error) {
        next(error)
    }
}

// 删除答案
exports.deleteAnswer = async (req, res, next) => {
    try {
        const id = req.params.id
        let answer = await Answer.findByIdAndDelete(id)
        if (!answer) return res.status(400).json({
            code: 400,
            msg: "删除答案失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "删除答案成功！",
            data: answer
        })
    } catch (error) {
        next(error)
    }
}