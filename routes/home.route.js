const express = require('express');
const { courseAuth } = require('../models/auth.model');
const detailModel = require('../models/home.model');
const router = express.Router();
//Đi đến trang chủ
router.get('/', async function (req, res) {
  console.log(req.session.cart)
    try {
      const list = await detailModel.topNewCourses()
      const topviewers = await detailModel.topViewersCourses()
      const topTopic = await detailModel.topTopic()
      const topinweek = await detailModel.topCourseInWeek()
      console.log(topinweek);
      res.render('home', {
        newCourses: list,
        empty: list === null,
        topViewers: topviewers,
        topTopic: topTopic,
        numTopTopic: topTopic === null,
        topinweek: topinweek
            });
    } catch (err) {
      console.error(err);
      res.send('View error log at server console.');
    }
  
  })
  router.get('/tos',function(req,res)
  {
    res.render('tos')
  })
  
  module.exports = router;


