const express = require('express')
const router = express.Router()
const User = require('../model/user')
router.get('/', function (req, res) {
  console.log(req.session, 'req.session');
  let user = req.session.user
  res.render('index', {
    title: '首页',
    user
  })
})
router.get('/login', function (req, res) {
  console.log('进入login');
  req.session.user = null // 清空服务端
  req.session.isLogin = false; // 清空服务端
  res.clearCookie("user", {}) // 清空客户端
  res.render('login', {
    title: '登录'
  })
})
router.get('/loginOut', function (req, res) {
  //清除session，cookie
  console.log('清空cookie');
  req.session.destroy(function () {
    res.redirect("/login")
  });
})
router.post('/login', function (req, res) {
  const {username, password} = req.body
  User.findOne({
    username,
    password
  }, function (err, data) {
    if (err) {
      return res.status(503).json({message: '服务异常', code: -1})
    }
    if (data) {
      // 验证通过
      req.session.user = data
      req.session.isLogin = true;
      res.json({code: 0, message: '登录成功'});
    } else {
      res.json({code: 1, message: '用户名或者密码错误!'});
    }
  })
})
router.get('/register', function (req, res) {
  res.render('register', {
    title: '注册用户'
  })
})
router.post('/registerUser', function (req, res) {
  console.log(req.body);
  const {username, email} = req.body
  User.findOne({
    $or: [
      {
        username,
      },
      {
        email
      }
    ]
  }, function (err, data) {
    if (err) {
      return res.statusCode(500).res.json({code: -1, message: '服务出现问题!'})
    }
    if (!data) {
      new User(req.body).save(function (err) {
        if (!err) {
          res.json({
            code: 0,
            message: '注册成功'
          })
        } else {
          return res.status(503).json({code: -1, message: '服务出现问题!'})
        }
      })
    } else {
      res.json({
        code: 1,
        message: '用户名或邮箱已存在!'
      })
    }
  })
})
module.exports = router
