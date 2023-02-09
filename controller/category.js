const { Category } = require("../model/category")

// 获取分类列表
exports.getCategorylist = async (req, res, next) => {
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
        // { content: new RegExp(keyword) } 模糊查询
        const categoryList = await Category.find({
            name: new RegExp(keyword)
        })
            .limit(pageTotal)
            .skip(pageIndex * pageTotal)
        if (!categoryList) return res.status(400).json({
            code: 400,
            msg: "获取分类列表失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取分类列表成功！",
            data: categoryList
        })
    } catch (error) {
        next(error)
    }
}

// 获取指定分类
exports.getCategory = async (req, res, next) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                code: 400,
                msg: "请传入分类 id",
            });
        }
        let category = null
        try {
            category = await Category.findById(id)
        } catch (error) {
            return res.status(400).json({
                code: 400,
                msg: "获取分类失败！"
            })
        }
        if (!category) return res.status(400).json({
            code: 400,
            msg: "获取分类失败！"
        })
        res.status(200).json({
            code: 200,
            msg: "获取分类成功！",
            data: category
        })
    } catch (error) {
        next(error)
    }
}

// 添加分类
exports.createCategory = async (req, res, next) => {
    try {
        let category = await Category.findOne(req.body)
        if (category) return res.status(400).json({
            code: 400,
            msg: "该类别已存在！"
        })
        category = new Category(req.body)
        await category.save()
        res.status(200).json({
            code: 200,
            msg: "分类添加成功！",
            data: req.body
        })
    } catch (error) {
        next(error)
    }
}

// 修改分类
exports.updateCategory = async (req, res, next) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                code: 400,
                msg: "请传入id"
            })
        }
        const { name } = req.body
        const categoryId = req.params.id
        // { new: true }会将更新之后的数据返回给category
        let category = await Category.findByIdAndUpdate(categoryId, { name }, { new: true })
        if (!category) return res.status(400).json({
            code: 400,
            msg: "更新分类失败！",
            data: name
        })
        res.status(200).json({
            code: 200,
            msg: "更新分类成功！",
            data: category
        })
    } catch (error) {
        next(error)
    }
}

// 删除分类
exports.deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id
        const data = await Category.findByIdAndDelete(categoryId)
        if (!data) return res.status(400).json({
            code: 400,
            msg: "删除失败！",
            data: { id: categoryId }
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