const mongoose = require("mongoose")
const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

const categorySchema = new mongoose.Schema({
    __v: {
        type: Number,
        select: false
    },
    // 分类名
    name: {
        type: String,
        require: true,
        maxlength: 50,
        minlength: 2
    }

})

const Category = mongoose.model("Category", categorySchema)

const categoryValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().max(50).min(2).required().messages({
            "string.base": "name 必须为string",
            "any.required": "缺少必选参数 name",
            "string.max": "name最多为50个字符",
            "string.min": "name最多为2个字符"
        }),
        _id: Joi.objectId()
    })
    return schema.validate(data)
}

module.exports = {
    Category,
    categoryValidator
}