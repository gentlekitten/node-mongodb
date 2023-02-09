# node.js+mongoDB

### 介绍
node.js+mongoDB数据库写的模板后端，包含了文件上传、一二级评论、登录验证等功能

### 安装依赖
```
npm install
```

### 修改数据库
```
config->index.js文件下找到：
     // 数据库的配置
    db: {
        url: process.env.MONGOOB_URL || "mongodb://localhost:27017/node_template"
    }
    将"mongodb://localhost:27017/node_template"修改为你的mongoDB数据库
```

### 启动项目
```
启动mongoDB数据库
cd template 
node/nodemon app.js
```


