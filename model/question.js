const mongoose = require("mongoose")
// 数据验证
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

const questionSchema = new mongoose.Schema({
    // 标题
    title: {
        type: String,
        require: true
    },
    // 描述
    description: {
        type: String
    },
    // 提交人
    questioner: {
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
    // 话题列表
    topics: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic"
        }],
        select: false
    }
}, { timestamps: true })

// 创建Model
const Question = mongoose.model("Question", questionSchema)

// 创建内容效验规则对象
const questionValidator = (data) => {
    const schema = Joi.object({
        title: Joi.string().required().messages({
            "any.required": "缺少必选参数title",
            "string.base": "title应该为string"
        }),
        description: Joi.string().messages({
            "string.base": "description必须为String"
        }),
        questioner: Joi.objectId().messages({
            "string.pattern.name": "bussiness必须为objectId类型"
        }),
        topics: Joi.array().items(Joi.object().keys({
            type: Joi.objectId
        })).messages({
            "array.base": "topics 必须为数组类型",
            "string.pattern.name": "数组中必须为objectId类型"
        }),
        _id: Joi.objectId()
    })
    return schema.validate(data)
}

// 导出
module.exports = {
    Question,
    questionValidator
}