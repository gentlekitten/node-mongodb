const mongoose = require("mongoose")
// 数据验证
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

const topicSchema = new mongoose.Schema({
    // 话题名字
    name: {
        type: String,
        require: true
    },
    // 图像
    avatar_url: {
        type: String
    },
    // 介绍
    introduction: {
        type: String,
        maxlength: 300,
        select: false
    },
    // 版本号
    __v: {
        type: String,
        select: false
    }
})

// 创建Model
const Topic = mongoose.model("Topic", topicSchema)

// 创建内容效验规则对象
const topicValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            "any.required": "缺少必选参数name",
            "string.base": "话题名应该为string"
        }),
        avatar_url: Joi.string().messages({
            "string.base": "avatar_url必须为String"
        }),
        introduction: Joi.string().max(300).messages({
            "string.base": "密码不符合规则",
            "string.max": "introduction最多为300个字符"
        }),
        _id: Joi.objectId()
    })
    return schema.validate(data)
}

// 导出
module.exports = {
    Topic,
    topicValidator
}