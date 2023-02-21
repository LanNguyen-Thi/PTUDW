const express = require('express');
const detailModel = require('../models/detailCourse.model');
const router = express.Router();
const courseAuth = require('../models/auth.model');
const { add } = require('../models/student.model');
const {  score,  rate,  average } = require('average-rating');
//Đi đến trang khóa học
router.get('/:id', async function (req, res) {
  var checkComment = false
    try {
 
      const coId = req.params.id;
      var check = false;
      if(res.locals.accounttype === true){
        check = await courseAuth.courseAuth(res.locals.stuAccount.idHocVien,coId)
        checkComment = await detailModel.checkComment(res.locals.stuAccount.idHocVien,coId)
      }
      const list = await detailModel.detailCourse(coId)
      const feedback = await detailModel.getFeedBack(coId)
      const relatedCourse = await detailModel.relatedCourse(coId)
      const teacherInfo = await detailModel.teacherinfo(coId)
      
     //Lấy danh sách chương + bài học
     const rows = await detailModel.listOfChapter(parseInt(coId));
     if (rows !== null){
        for (var i = 0;i<rows.length;i++){
          var less = JSON.parse(JSON.stringify(await detailModel.listOfLesson(rows[i].idChuongKhoaHoc))) 
        rows[i].lessons = less
        }
     }
     //

      res.render('guest/detail-course', {
        detCourse: list,
        empty: list.length === 0,
        feedback: feedback,
        feedEmp: feedback === null,
        relatedCourse: relatedCourse,
        emptyRelatedCourse: relatedCourse === null,
        teacher: teacherInfo,
        courseAuth: check,
        noChappter: rows === null,
        chapters: rows,
        checkComment: checkComment
      });
    } catch (err) {
      console.error(err);
      res.send('View error log at server console.');
    }
  
  })

  router.post('/:id/addComment', async function (req, res) {
    try {
      const idHocVien = res.locals.stuAccount.idHocVien
      const IdKhoaHoc = parseFloat(req.params.id)

      const danhgia ={
        HocVien_idHocVien: idHocVien,
        KhoaHoc_IdKhoaHoc: IdKhoaHoc,
        NhanXet: req.body.comment,
        Diem: parseFloat(req.body.selected_rating),
        NgayDanhGia: new Date().toISOString().slice(0, 10)
      }

     await detailModel.addComment(danhgia)
     res.redirect(req.headers.referer);
   
    } catch (err) {
      console.error(err);
      res.send('View error log at server console.');
    }
  
  })
 
  module.exports = router;





