const { Article } = require("../model/article")

// 获取文章列表
exports.getArticleList = async (req, res, next) => {
    try {
        let {
            pageTotal = 10,
            pageIndex = 1,
            keyword = "" } = req.query
        // 每页有几项
        pageTotal = Math.max(pageTotal * 1, 1)
        // 当前是第几页
        pageIndex = Math.max(pageIndex * 1, 1) - 1
        // limit()显示多少数据，skip()跳过多少数据
        const articleList = await Article.find({
            title: new RegExp(keyword),
        })
            .limit(pageTotal)
            .skip(pageIndex * pageTotal)
        if (!articleList) return res.status(400).json({
            code: 400,
            msg: "获取文章列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取文章列表成功！",
            data: articleList
        })
    } catch (error) {
        next(error)
    }
}

// 获取指定文章
exports.getArticle = async (req, res, next) => {
    try {
        const id = req.params.id
        let article = null
        try {
            article = await Article.findById(id).populate("category author")
        } catch (error) {
            return res.status(400).json({
                code: 400,
                msg: "获取文章失败！"
            })
        }
        if (!article) return res.status(400).json({
            code: 400,
            msg: "获取文章失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取文章成功！",
            data: article
        })
    } catch (error) {
        next(error)
    }
}

// 创建文章
exports.createArticle = async (req, res, next) => {
    try {
        article = new Article({
            ...req.body,
            author: req.userData._id
        })
        await article.save()
        res.status(200).json({
            code: 200,
            msg: "添加文章成功！"
        })
    } catch (error) {
        next(error)
    }
}

// 修改文章
exports.updateArticle = async (req, res, next) => {
    try {
        const articleId = req.params.id
        let article = await Article.findByIdAndUpdate(articleId, req.body, { new: true })
        if (!article) return res.status(400).json({
            code: 400,
            msg: "更新文章失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "更新文章成功！",
            data: article
        })
    } catch (error) {
        next(error)
    }
}

// 删除文章
exports.deleteArticle = async (req, res, next) => {
    try {
        const articleId = req.params.id
        const data = await Article.findByIdAndDelete(articleId)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "删除失败！",
            data: { id: articleId }
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