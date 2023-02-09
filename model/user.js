const mongoose = require("mongoose")
// 数据验证
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

const config = require("../config/index")
// token生成
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    // 邮箱
    email: {
        type: String,
        require: true,
        minlength: 6,
        maxlength: 30,
        unique: true
    },
    // 用户名
    username: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 20,
    },
    // 密码
    password: {
        type: String,
        require: true,
        minlength: 6,
        maxlength: 100,
        // select:false查询数据时不实现该项
        select: false
    },
    // 版本号
    __v: {
        type: String,
        select: false
    },
    // 封面、头像
    avatar_url: {
        type: String,
        select: false,
    },
    // 性别
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male",
        require: true,
        select: false
    },
    // 一句话介绍
    headline: {
        type: String,
        maxlength: 100,
        select: false
    },
    // 居住地
    locations: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
        select: false
    },
    // 行业
    bussiness: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        select: false
    },
    // 职业经历
    employments: {
        type: [{
            company: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
            job: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" }
        }],
        select: false
    },
    // 教育模块
    educations: {
        type: [{
            school: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
            major: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
            // 学历
            diploma: { type: Number, enum: [1, 2, 3, 4] },
            entrance_year: { type: Number },
            graduation_year: { type: Number }
        }],
        select: false
    },
    // 关注与粉丝部分
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        select: false
    },
    // 关注话题列表
    followingTopic: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic"
        }],
        select: false
    },
    // 赞和踩部分
    likingAnswers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }],
        select: false
    },
    dislikingAnswers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }],
        select: false
    },
    // 收藏答案列表
    collectingAnswers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Answer',
        }],
        select: false
    }
})

// 封装生成token功能,expiresIn是token生效时间,该函数会直接挂载到User模型上
userSchema.methods.generateToken = function () {
    return jwt.sign({
        _id: this._id
    }, config.secret, { expiresIn: '10d' })
}

// 创建Model
const User = mongoose.model("User", userSchema)

// 创建内容效验规则对象
const userValidator = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().trim().lowercase().required().messages({
            "any.required": "缺少必选参数email",
            "string.email": "email格式错误"
        }),
        username: Joi.string().min(2).max(50).required().messages({
            "any.required": "缺少必选参数username",
            "string.base": "username必须为String",
            "string.max": "username最多为20个字符",
            "string.min": "username最多为2个字符",
        }),
        password: Joi.string().pattern(/^[a-zA-Z0-9]{6,12}$/).required().messages({
            "string.pattern.base": "密码不符合规则",
            "any.required": "缺少必选参数passwor"
        }),
        _id: Joi.objectId(),
        avatar_url: Joi.string().messages({
            "string.base": "图像地址必须为String类型"
        }),
        gender: Joi.any().valid("male", "female").default("male").messages({
            "any.only": "传入的值无效"
        }),
        headline: Joi.string().max(100).messages({
            "string.base": "headline必须为String",
            "string.max": "headline最多为100个字符"
        }),
        locations: Joi.array().items(Joi.objectId()).messages({
            "array.base": "locations必须为数组",
            "string.pattern.name": "数组中必须为objectId类型"
        }),
        bussiness: Joi.objectId().messages({
            "string.pattern.name": "bussiness必须为objectId类型"
        }),
        employments: Joi.array().items(
            Joi.object().keys({
                company: Joi.objectId(),
                job: Joi.objectId()
            }).messages({
                "array.base": "employments必须为数组",
                "string.pattern.name": "company和job必须为objectId类型",
                "object.unknown": "传入数据有误"
            })
        ),
        educations: Joi.array().items(
            Joi.object().keys({
                school: Joi.objectId(),
                major: Joi.objectId(),
                diploma: Joi.number().valid(1, 2, 3, 4),
                entrance_year: Joi.number(),
                graduation_year: Joi.number()
            }).messages({
                "array.base": "employments必须为数组",
                "any.only": "diploma只能从[1,2,3,4]中选择",
                "string.pattern.name": "school和major必须为objectId类型",
                "number.base": "entrance_year和graduation_year必须为number类型",
                "object.unknown": "传入数据有误"
            })
        ),
        following: Joi.array().items(
            Joi.object().keys({
                type: Joi.objectId()
            }).messages({
                "array.base": "following必须为数组类型",
                "string.pattern.name": "必须为 objectId 类型",
            })
        ),
        followingTopic: Joi.array().items(
            Joi.object().keys({
                type: Joi.objectId()
            })
        ).messages({
            "array.base": "followingTopic 必须为数组类型",
            "string.pattern.name": "必须为 objectId 类型",
        }),
        likingAnswers: Joi.objectId().messages({
            "string.pattern.name": "likingAnswers必须为objectId类型"
        }),
        dislikingAnswers: Joi.objectId().messages({
            "string.pattern.name": "dislikingAnswers必须为objectId类型"
        }),
        collectingAnswers: Joi.array().items(
            Joi.object().keys({
                type: Joi.objectId()
            })
        ).messages({
            "array.base": "collectingAnswers 必须为数组类型",
            "string.pattern.name": "必须为 objectId 类型",
        }),
    })
    return schema.validate(data)
}

// 导出
module.exports = {
    User,
    userValidator
}