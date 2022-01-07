const express = require('express')
const router = require('./router')
const path = require('path');
const engine = require('ejs-locals')
const bodyParser = require('body-parser')
const session = require('express-session');
const FileStore = require('session-file-store')(session);
// 链接数据库
require('./model/connect')

const app = express()
app.use(session({
  name: 'session_id',
  secret: 'chyingp', // 用来对session id相关的cookie进行签名
  store: new FileStore(), // 本地存储session（文本文件，也可以选择其他store，比如redis的）
  saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
  resave: false, // 是否每次都重新保存会话，建议false
  cookie: {
    user: null,
    maxAge: 7 * 24* 60 * 60 * 1000
  }
}));

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(router)
app.use('/public', express.static(path.resolve(__dirname, './public')))
app.use('/node_modules', express.static(path.resolve(__dirname, './node_modules')))
app.engine('ejs', engine);
// app.set('views',__dirname + '/views');
app.set('view engine', 'ejs')
app.listen(3000, () => console.log('服务已启动:3000端口...'))
