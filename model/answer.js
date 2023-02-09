const mongoose = require("mongoose")
// 数据验证
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

const answerSchema = new mongoose.Schema({
    // 回答内容
    content: {
        type: String,
        require: true
    },
    // 回答人
    answerer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false
    },
    // 版本号
    __v: {
        type: String,
        select: false
    },
    // 问题id
    questionId: {
        type: String
    },
    // 赞/踩数
    voteCount: {
        type: Number,
        default: 0,
        require: true
    }
}, { timestamps: true })

// 创建Model
const Answer = mongoose.model("Answer", answerSchema)

// 创建内容效验规则对象
const answerValidator = (data) => {
    const schema = Joi.object({
        content: Joi.string().required().messages({
            "any.required": "缺少必选参数content",
            "string.base": "content应该为string"
        }),
        questionId: Joi.string().messages({
            "string.base": "questionId必须为String"
        }),
        answerer: Joi.objectId().messages({
            "string.pattern.name": "answerer必须为objectId类型"
        }),
        voteCount: Joi.number().messages({
            "number.base": "content应该为number"
        }),
        _id: Joi.objectId()
    })
    return schema.validate(data)
}

// 导出
module.exports = {
    Answer,
    answerValidator
}