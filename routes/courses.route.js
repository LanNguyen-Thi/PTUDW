const express = require('express');
const courseModel = require('../models/courses.model');
const db = require('../utils/db');
const router = express.Router();
//Đi đến trang khóa học
router.get('/:id', async function (req, res) {
    try {
      const coId = req.params.id;
     // const list = await courseModel.infoCourses();
      const list = await courseModel.courseByCateg(coId)
      if(list !== null){
        for (var i = 0;i<list.length;i++){
          var isNew = await courseModel.checkNewest(list[i].IdKhoaHoc)
          var isBestSeller = await courseModel.checkBestSeller(list[i].IdKhoaHoc)
          if(isNew == true){
            list[i].isNew = true
          }
          else{
            list[i].isNew = false
          }
          if(isBestSeller == true){
            list[i].isBestSeller= true
          }
          else{
            list[i].isBestSeller = false
          }

        }
    
      }
     const categ = await courseModel.allWithDetails()
     // console.log(res.locals.lcCategories)
      res.render('guest/courses', {
        mycourses: list,
        empty: list === null,
        categ: categ,
        numOfCateg: categ === null
      });
    } catch (err) {
      console.error(err);
      res.send('View error log at server console.');
    }
  
  })
  //Đi đến trang khóa học chi tiết
  
  
 
  module.exports = router;





