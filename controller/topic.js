const { Topic } = require("../model/topic")

// 获取话题列表
exports.getTopiclist = async (req, res, next) => {
    try {
        let { pageTotal = 10, pageIndex = 1, keyword = "" } = req.query
        // 每页有几项
        pageTotal = Math.max(pageTotal * 1, 1)
        // 当前是第几页
        pageIndex = Math.max(pageIndex * 1, 1) - 1
        // limit()显示多少数据，skip()跳过多少数据
        // { name: new RegExp(keyword) } 模糊查询
        const topicList = await Topic.find({ name: new RegExp(keyword) })
            .limit(pageTotal)
            .skip(pageIndex * pageTotal)
        if (!topicList) return res.status(400).json({
            code: 400,
            msg: "获取话题列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取话题列表成功！",
            data: topicList
        })
    } catch (error) {
        next(error)
    }
}

// 获取指定话题
exports.getTopic = async (req, res, next) => {
    try {
        const id = req.params.id
        const { fields = "" } = req.query
        const selectFields = fields.split(";").filter(f => f).map(f => " +" + f).join("")
        let topic = null
        try {
            topic = await Topic.findById(id).select(selectFields)
        } catch (error) {
            return res.status(400).json({
                code: 400,
                msg: "获取话题失败！",
                data: topic
            })
        }
        if (!topic) return res.status(400).json({
            code: 400,
            msg: "获取话题失败！",
            data: topic
        })
        res.status(200).json({
            code: 200,
            msg: "获取话题成功！",
            data: topic
        })
    } catch (error) {
        next(error)
    }
}

// 创建话题
exports.createTopic = async (req, res, next) => {
    try {
        const data = req.body
        let topic = await Topic.findOne(data)
        if (topic) return res.status(400).json({
            code: 400,
            msg: "话题已存在！"
        })
        topic = new Topic(data)
        await topic.save()
        res.status(200).json({
            code: 200,
            msg: "话题添加成功！",
            data
        })
    } catch (error) {
        next(error)
    }
}

// 修改话题
exports.updateTopic = async (req, res, next) => {
    try {
        const data = req.body
        const id = req.params.id
        let topic = await Topic.findByIdAndUpdate(id, data)
        if (!topic) return res.status(400).json({
            code: 400,
            msg: "更新话题失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "更新话题成功！",
            data
        })
    } catch (error) {
        next(error)
    }
}