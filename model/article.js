const mongoose = require("mongoose")
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

const articleSchema = new mongoose.Schema({
    __v: {
        type: Number,
        select: false
    },
    // 标题
    title: {
        type: String,
        require: true,
        maxlength: 50,
        minlength: 2
    },
    // 内容
    content: {
        type: String,
        require: true,
        maxlength: 200,
        minlength: 2
    },
    // 类别id
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        require: true
    },
    // 作者
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // 状态
    status: {
        type: String,
        enum: ["published", "drafted", "trashed"],
        default: "published",
    },
    createdTime: { type: Number },
    updatedTime: { type: Number }
}, {
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime',
        currentTime: () => Date.now()
    }
})

const Article = mongoose.model("Article", articleSchema)

const articleValidator = (data) => {
    const schema = Joi.object({
        content: Joi.string().min(2).max(200).required().messages({
            "string.base": "content 必须为string",
            "any.required": "缺少必选参数 content",
            "string.max": "content 最多为200个字符",
            "string.min": "content 最多为2个字符"
        }),
        title: Joi.string().min(2).max(50).required().messages({
            "string.base": "title 必须为string",
            "any.required": "缺少必选参数 title",
            "string.max": "title 最多为50个字符",
            "string.min": "title 最多为2个字符"
        }),
        author: Joi.objectId().messages({
            "string.pattern.name": "author 必须为objectId类型"
        }),
        status: Joi.string().valid("published", "drafted", "trashed").required().messages({
            "string.base": "status 必须为字符串",
            "any.required": "status 必须设置",
            "any.only": "status 取值有误, 可选值为 published|drafted|trashed"
        }),
        category: Joi.objectId().required().messages({
            "string.pattern.name": "category 必须为objectId类型",
            "any.required": "category 必须设置"
        }),
        _id: Joi.objectId()
    })
    return schema.validate(data)
}

module.exports = {
    Article,
    articleValidator
}