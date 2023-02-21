const express = require('express');
const teacherAuth = require('../middleware/TeacherAuth.mdw');
const teacherModel = require('../models/teacher.model');
const userModel = require('../models/user.model');
const course =require("../models/mycourses.model");
const courseModel =require("../models/courses.model");
const router = express.Router();
const accModel=require("../models/account.model");
const detailModel=require("../models/detailCourse.model");
const bcrypt = require('bcryptjs');
const db = require('../utils/db');
const vViewVideo = require('../models/view-video.model');

router.get('/', teacherAuth, async function (req, res) {
  res.render('teacher/profile');
})

router.get('/edit-pass', teacherAuth, async function (req, res) {
  res.render('teacher/editPass');
})

router.post('/edit-name', async function (req, res) {
  const newname = req.body.TenGiangVien;
  const id = req.body.idGiangVien
  await teacherModel.update(newname, id, 'TenGiangVien')
  res.redirect(req.headers.referer);
})

router.post('/edit-email', async function (req, res) {
  const newEmail = req.body.Email;
  const id = req.body.idGiangVien
  await teacherModel.update(newEmail, id, 'Email')
  res.redirect(req.headers.referer);
})

router.post('/edit-dob', async function (req, res) {
  const newDOB = req.body.NgaySinh;
  const id = req.body.idGiangVien;
  var parts = newDOB.split('/');
  const dob = parts[2] + '/' + parts[1] + '/' + parts[0];
  await teacherModel.update(dob, id, 'NgaySinh');
  res.redirect(req.headers.referer);
})

router.post('/edit-pass', async function (req, res) {
  const id = req.body.idTaiKhoan;
  const teacher = await userModel.single(id);
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  console.log(teacher.MatKhau)
  const ret = bcrypt.compareSync(oldPassword, teacher.MatKhau);
  console.log(ret);
  if (ret === false) {
    return res.render('teacher/editPass', {
      err_message: 'Invalid old password.'
    });
  }
  const hash = bcrypt.hashSync(newPassword, 10);
  await userModel.update(hash, id, 'MatKhau');
  res.render('teacher/editPass', {
    succ_message: 'Success changing your password.'
  });
})


router.get('/allmycourses', teacherAuth, async function (req, res) {
    const allCourses = await courseModel.allByTeacher(res.locals.authTeacher.idGiangVien)
    res.render("teacher/allmycourses",{
      allCourses: allCourses
    })
  
})

router.post('/addCourse',  async function (req, res) {
  console.log(req.body)

  const course = {
    IdKhoaHoc: null,
    TenKhoaHoc: req.body.title,
    MoTaNgan: req.body.subtitle,
    MoTaChiTiet: req.body.description,
    DiemDanhGia: 5,
    SoLuongHVDanhGia: 0 ,
    SoLuongHVDangKy: 0,
    NgayCapNhat: new Date().toISOString().slice(0, 10),
    SoLuotXem: 0,
    HocPhi: +req.body.price,
    KhuyenMai: +req.body.promotion,
    HinhDaiDien: req.body.fuMain,
    TrangThai:  1,
    NguoiTao: res.locals.authTeacher.idGiangVien,
    NguoiDay: res.locals.authTeacher.idGiangVien,
    LinhVuc:  req.body.category,
    HienThi: 1

  }
  await courseModel.addCourse(course)
  const idCourse = (await courseModel.lastIdCourse())[0].IdKhoaHoc

  const soChuong = +req.body.Sochuong;
  for(var i = 1;i<=soChuong;i++){
      const chapter = {
        idChuongKhoaHoc: null,
        TenChuong: req.body['chapter'+i],
        KhoaHoc_IdKhoaHoc: idCourse,
      }
      await courseModel.addChapter(chapter)
      const idChap = (await courseModel.lastIdChapter())[0].idChuongKhoaHoc
      console.log(idChap)
      let Lesson= req.body["Chapter"+i]
      if(typeof(Lesson) == 'string')
      {
        const newLesson = {
          idBaiHoc: null,
          TenBaiHoc: Lesson,
          ChuongKhoaHoc_idChuongKhoaHoc:  idChap,
        }
        await courseModel.addLesson(newLesson)
        const idLesson = (await courseModel.lastIdLesson())[0].idBaiHoc
        const video = req.body['video'+i]
        if (video !== ''){
          const newVideo = {
            idVideo: null,
            DiaChi: '/video/'+video,
            BaiHoc_idBaiHoc: idLesson,
          }
          await courseModel.addVideo(newVideo)
        }
       
      }
      else if(typeof(Lesson) == 'object')
      {
          for (obj of Lesson){
            const newLesson = {
              idBaiHoc: null,
              TenBaiHoc: obj,
              ChuongKhoaHoc_idChuongKhoaHoc:  idChap,
            }
            await courseModel.addLesson(newLesson)
            const idLesson = (await courseModel.lastIdLesson())[0].idBaiHoc
            const video = req.body['video'+i][Lesson.indexOf(obj)]
            if (video !== ''){
              const newVideo = {
                idVideo: null,
                DiaChi: '/video/'+video,
                BaiHoc_idBaiHoc: idLesson,
              }
              await courseModel.addVideo(newVideo)
            }
            

          }
      }

  }
  res.redirect(req.headers.referer);

})
router.post('/allmycourses', teacherAuth, async function (req, res) {
  account=await accModel.getIdbyAcccount(req.session.username);
  giangvien=await teacherModel.getIdbyAcccount(account[0].idtaikhoan);
  courses=await course.allmycourse(giangvien[0].idGiangVien);
  res.send(courses);
})

router.get('/profile', teacherAuth, async function (req, res) {
  res.render('teacher/profile');
})
router.get('/addnewcourse', teacherAuth, async function (req, res) {
  const categ2 = await courseModel.allCateg2();
  res.render('teacher/addnewcourse',{
    categ2: categ2  });
})
router.get('/editcourse/:id', teacherAuth, async function (req, res) {
  try {
 
    const coId = req.params.id;

    const list = await detailModel.detailCourse(coId)
    
   //Lấy danh sách chương + bài học
   const rows = await detailModel.listOfChapter(parseInt(coId));
   if (rows !== null){
      for (var i = 0;i<rows.length;i++){
        var less = JSON.parse(JSON.stringify(await detailModel.listOfLesson(rows[i].idChuongKhoaHoc))) 
      rows[i].lessons = less
      if (less !== null){
        for (var j=0;j<less.length;j++){
         
          const hasVideo = await vViewVideo.hasVideo(less[j].idBaiHoc)
          if(hasVideo == true) {
            less[j].DiaChi = (await vViewVideo.videoByLesson(less[j].idBaiHoc)).DiaChi
            console.log(less[j].DiaChi)
          
          }
          else{
            less[j].DiaChi = null
          }
          less[j].hasVideo = hasVideo
        }
        
      }
      
   }}
   //

    res.render('teacher/editcourse', {
      detCourse: list,
      empty: list.length === 0,
      chapters: rows,
    });
  } catch (err) {
    console.error(err);
    res.send('View error log at server console.');
  }
})

router.get('/addLesson/:id', teacherAuth, async function (req, res) {
  try {
 
    const coId = req.params.id;

    const list = await detailModel.detailCourse(coId)
    
   //Lấy danh sách chương + bài học
   const rows = await detailModel.listOfChapter(parseInt(coId));
   if (rows !== null){
      for (var i = 0;i<rows.length;i++){
        var less = JSON.parse(JSON.stringify(await detailModel.listOfLesson(rows[i].idChuongKhoaHoc))) 
      rows[i].lessons = less
      if (less !== null){
        for (var j=0;j<less.length;j++){
         
          const hasVideo = await vViewVideo.hasVideo(less[j].idBaiHoc)
          if(hasVideo == true) {
            less[j].DiaChi = (await vViewVideo.videoByLesson(less[j].idBaiHoc)).DiaChi
            console.log(less[j].DiaChi)
          
          }
          else{
            less[j].DiaChi = null
          }
          less[j].hasVideo = hasVideo
        }
        
      }
      
   }}
   //

    res.render('teacher/addLesson', {
      detCourse: list,
      empty: list.length === 0,
      chapters: rows,
    });
  } catch (err) {
    console.error(err);
    res.send('View error log at server console.');
  }
})
router.get('/editprofile', teacherAuth, async function (req, res) {
  res.render('teacher/editprofile');
})
router.get('/allcourses/detail/:id', teacherAuth, async function (req, res) {

    try {
 
      const coId = req.params.id;
      console.log(coId)

      const list = await detailModel.detailCourse(coId)
      
     //Lấy danh sách chương + bài học
     const rows = await detailModel.listOfChapter(parseInt(coId));
     if (rows !== null){
        for (var i = 0;i<rows.length;i++){
          var less = JSON.parse(JSON.stringify(await detailModel.listOfLesson(rows[i].idChuongKhoaHoc))) 
        rows[i].lessons = less
        if (less !== null){
          for (var j=0;j<less.length;j++){
           
            const hasVideo = await vViewVideo.hasVideo(less[j].idBaiHoc)
            less[j].hasVideo = hasVideo
          }
          
          
        }
        
     }}
     //

      res.render('teacher/detail-course', {
        detCourse: list,
        empty: list.length === 0,
        noChappter: rows === null,
        chapters: rows,
      });
    } catch (err) {
      console.error(err);
      res.send('View error log at server console.');
    }

})

router.post('/editCourse/:id',  async function (req, res) {
  const coId = req.params.id;
  console.log(req.body)
  const course = {
    TenKhoaHoc: req.body.title,
    MoTaNgan: req.body.subtitle,
    MoTaChiTiet: req.body.description,
    DiemDanhGia: 5,
    SoLuongHVDanhGia: 0 ,
    SoLuongHVDangKy: 0,
    NgayCapNhat: new Date().toISOString().slice(0, 10),
    SoLuotXem: 0,
    HocPhi: +req.body.price,
    KhuyenMai: +req.body.promotion,
    HinhDaiDien: req.body.fuMain,
    TrangThai:  1,
    NguoiTao: res.locals.authTeacher.idGiangVien,
    NguoiDay: res.locals.authTeacher.idGiangVien,
    LinhVuc:  req.body.category,
    HienThi: 1

  }
   await courseModel.update(course,{IdKhoaHoc: coId},'khoahoc')
  
  res.redirect(req.headers.referer);

})

router.post('/addLesson',  async function (req, res) {
  console.log(req.body)
  const Lessons = req.body.Lesson
  if(Lessons !== ''){
    if(typeof(Lessons) == 'string')
    {
      const BaiHoc ={
        idBaiHoc: null,
        TenBaiHoc: Lessons,
        ChuongKhoaHoc_idChuongKhoaHoc: +req.body.idChuongKhoaHoc
      }
      await courseModel.addLesson(BaiHoc)
      const idLesson = (await courseModel.lastIdLesson())[0].idBaiHoc
      const video = req.body.video
      if (video !== ''){
        const newVideo = {
          idVideo: null,
          DiaChi: video,
          BaiHoc_idBaiHoc: idLesson,
        }
        await courseModel.addVideo(newVideo)
      }
     
    }
    else if(typeof(Lessons) == 'object')
    {
      for(var i=0;i<Lessons.length;i++){
        const BaiHoc ={
          idBaiHoc: null,
          TenBaiHoc: Lessons[i],
          ChuongKhoaHoc_idChuongKhoaHoc: +req.body.idChuongKhoaHoc
        }
        await courseModel.addLesson(BaiHoc)
          
          const idLesson = (await courseModel.lastIdLesson())[0].idBaiHoc
          const video = req.body.video[i]
          if (video !== ''){
            const newVideo = {
              idVideo: null,
              DiaChi: video,
              BaiHoc_idBaiHoc: idLesson,
            }
            await courseModel.addVideo(newVideo)
          }
          

        }
    
    }
  }
  // const course = {
  //   TenKhoaHoc: req.body.title,
  //   MoTaNgan: req.body.subtitle,
  //   MoTaChiTiet: req.body.description,
  //   DiemDanhGia: 5,
  //   SoLuongHVDanhGia: 0 ,
  //   SoLuongHVDangKy: 0,
  //   NgayCapNhat: new Date().toISOString().slice(0, 10),
  //   SoLuotXem: 0,
  //   HocPhi: +req.body.price,
  //   KhuyenMai: +req.body.promotion,
  //   HinhDaiDien: req.body.fuMain,
  //   TrangThai:  1,
  //   NguoiTao: res.locals.authTeacher.idGiangVien,
  //   NguoiDay: res.locals.authTeacher.idGiangVien,
  //   LinhVuc:  req.body.category,
  //   HienThi: 1

  // }
  //  await courseModel.update(course,{IdKhoaHoc: coId},'khoahoc')
  
  res.redirect(req.headers.referer);

})
module.exports = router
