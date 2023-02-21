const express = require('express');
const auth = require('../middleware/auth.mdw');
const router = express.Router();
const wlishModel = require('../models/wishlist.model')

router.get('/', auth, async function (req, res) 
  {
    try {
        const id = res.locals.stuAccount.idHocVien
        const list =  await wlishModel.all(id)
      res.render('user/mywatchlist', {
        wishList: list,
        empty: list === null,
        nCourses: list === null? 0:list.length,
      });
    } catch (err) {
      console.error(err);
      res.send('View error log at server console.');
    }
  
  })

  router.post('/remove', async function (req, res) {
    const IdKhoaHoc = req.body.IdKhoaHoc;
    const idHocVien = req.body.idHocVien;

   await wlishModel.remove(idHocVien,IdKhoaHoc,'hocvien_yeuthich_khoahoc');
  res.redirect(req.headers.referer);
  })


  router.post('/add', async function (req, res) {
    if(req.session.authUser===user&&req.session.authAdmin===''&&req.session.authTeacher==='')
    {
      const IdKhoaHoc = req.body.IdKhoaHoc;
    const idHocVien = req.body.idHocVien;
 
    await wlishModel.add(idHocVien,IdKhoaHoc,'hocvien_yeuthich_khoahoc');
    res.redirect(req.headers.referer);
    }
  })

  

module.exports = router
