const { User } = require("../model/user")
const bcrypt = require("bcrypt")

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.validValue

        const user = await User.findOne({ email }).select("+password")
        if (!user) return res.status(400).json({
            code: 400,
            msg: "用户名或者密码错误！"
        })
        // 验证密码,使用bcrypt进行密码的比较
        const compareResult = await bcrypt.compare(password, user.password)
        if (!compareResult) return res.status(400).json({
            code: 400,
            msg: "用户名或者密码错误！"
        })
        res.status(200).json({
            code: 200,
            msg: "登录成功！",
            authorization: {
                token: user.generateToken()
            }
        })
    } catch (error) {
        next(error)
    }
}