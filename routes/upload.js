const router = require("express").Router()

const home = require("../controller/upload")

// 引入上传文件模块
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

router.post("/", upload.single("file"), home.upload)

module.exports = router