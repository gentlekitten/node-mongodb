const mongoose = require("mongoose")
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

const commentSchema = new mongoose.Schema({
    __v: {
        type: Number,
        select: false
    },
    // 内容
    content: {
        type: String,
        require: true
    },
    // 评论人
    commentator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
        select: false
    },
    // 问题id
    questionId: {
        type: String
    },
    // 答案id
    answerId: {
        type: String
    },
    // 父评论id
    rootCommentId: {
        type: String
    },
    // 回复的用户的id
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdTime: { type: Number },
    updatedTime: { type: Number }
}, {
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime',
        currentTime: () => Date.now()
    }
}) // timestamps: 添加时间

const Comment = mongoose.model("Comment", commentSchema)

const commentValidator = (data) => {
    const schema = Joi.object({
        content: Joi.string().required().messages({
            "string.base": "content 必须为string",
            "any.required": "缺少必选参数 content",
        }),
        commentator: Joi.objectId().messages({
            "string.pattern.name": "commentator 必须为objectId类型"
        }),
        questionId: Joi.string().messages({
            "string.base": "questionId 必须为string",
        }),
        answerId: Joi.string().messages({
            "string.base": "answerId 必须为string",
        }),
        rootCommentId: Joi.string().messages({
            "string.base": "rootCommentId 必须为string",
        }),
        replyTo: Joi.objectId().messages({
            "string.pattern.name": "replyTo 必须为objectId类型"
        }),
        _id: Joi.objectId()
    })
    return schema.validate(data)
}

module.exports = {
    Comment,
    commentValidator
}