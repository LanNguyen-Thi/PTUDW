const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const stuModel = require('../models/student.model');
const teacherModel = require('../models/teacher.model');
const authModel = require('../models/auth.model')

router.get('/', async function (req, res) {
  if(res.locals.accounttype === true || res.locals.Admintype === true || res.locals.Teachertype === true ){
    res.redirect('/');
  }
  const ref = req.headers.referer
  if (req.headers.referer) {
    req.session.retUrl = ref;
  }

  res.render('user/login');
})
router.get('/other', async function (req, res) {
  if(res.locals.accounttype === true || res.locals.Admintype === true || res.locals.Teachertype === true ){
    res.redirect('/');
  }
  res.render('guest/login')
})
router.post('/', async function (req, res) {
  const stu = await stuModel.singleByEmail(req.body.email);
  if (stu.length === 0) {
    return res.render('user/login', {
      err_message: 'Invalid Email or password.'
    });
  }
  const lock = (await userModel.singleByidTaiKhoan(stu[0].TaiKhoan_idTaiKhoan)).TrangThai
  if(lock!==1){
     return res.render('user/login', {
      err_message: 'Invalid Email or password.'
    });
  }
  const user = await userModel.singleByidTaiKhoan(stu[0].TaiKhoan_idTaiKhoan);
  const ret =  bcrypt.compareSync(req.body.password, user.MatKhau);
  if (ret === false) {
    return res.render('user/login', {
      err_message: 'Invalid Email or password.'
    });
  }
  req.session.accounttype=true;
  req.session.authUser=user;
  let url = req.session.retUrl || '/';
  if(url == '/register/confirmOTP') {
    url = '/user/profile'
  }
  res.redirect(url);
})

router.post('/other', async function (req, res) {

  const type = req.body.option;
  if(type === 'Admin'){
    const admin = await authModel.checkAdmin(req.body.username)
    if(admin === null) {
      return res.render('guest/login', {
        err_message: 'Invalid Username or password.'
      });
    }
    const ret =  bcrypt.compareSync(req.body.password, admin.MatKhau);
    if (ret === false) {
      return res.render('guest/login', {
        err_message: 'Invalid Username or password.'
      });
    }
    
    req.session.Admintype=true;
    req.session.authAdmin= admin;
    res.redirect('/admin/allcategories');
  }
  else if(type === 'Giảng viên'){
    console.log(req.body.username)
    const teacher = await authModel.checkTeacher(req.body.username)
    console.log(teacher)
    if(teacher=== null) {
      return res.render('guest/login', {
        err_message: 'Invalid Username or password 1.'
      });
    }
    const ret =  bcrypt.compareSync(req.body.password, teacher.MatKhau);
    if (ret === false) {
      return res.render('user/login', {
        err_message: 'Invalid Username or password.'
      });
    }
    req.session.username=req.body.username;
    req.session.Teachertype=true;
    req.session.authTeacher =  teacher;
    res.redirect('/teacher');
  }

})

router.post('/-out', async function (req, res) {

  req.session.accounttype=false;
  req.session.Admintype=false;
  req.session.Teachertype=false;
  req.session.authUser=null;
  req.session.authAdmin=null;
  req.session.authTeacher = null;
  res.redirect(req.headers.referer);
})



module.exports = router;