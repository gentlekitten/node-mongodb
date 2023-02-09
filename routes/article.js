const router = require("express").Router()

const { articleValidator } = require("../model/article")
const validator = require("../middleware/validate")

const article = require("../controller/article")

const auth = require("../middleware/auth")

// 获取文章
router.get("/", article.getArticleList)

// 获取指定文章
router.get("/:id", article.getArticle)

// 新增文章
router.post("/", [auth, validator(articleValidator)], article.createArticle)

// 编辑文章
router.patch("/:id", [auth, validator(articleValidator)], article.updateArticle)

// 删除文章
router.delete("/:id", auth, article.deleteArticle)

module.exports = router