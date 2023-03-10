const categoryModel = require('../models/courses.model');
const stuModel = require('../models/student.model')
const teacherModel = require('../models/teacher.model')
const wListModel = require('../models/wishlist.model')

module.exports = function (app) {
  app.use(async function (req, res, next) {
    if (typeof (req.session.accounttype) === 'undefined') {
      req.session.accounttype = false;
    }
    else if (typeof (req.session.Admintype) === 'undefined') {
      req.session.Admintype = false;
    }
    else if (typeof (req.session.Teachertype) === 'undefined') {
      req.session.Teachertype = false;
    }
    res.locals.accounttype = req.session.accounttype;
    res.locals.Admintype = req.session.Admintype;
    res.locals.Teachertype = req.session.Teachertype;
    res.locals.authUser = req.session.authUser;
    res.locals.authTeacher = req.session.authTeacher;
    res.locals.authAdmin = req.session.authAdmin;
    if(res.locals.accounttype === true){
      const HocVien = await stuModel.singleByidTaiKhoan(res.locals.authUser.idTaiKhoan)
      res.locals.stuAccount = HocVien
      
      const nItems = await wListModel.nItem(HocVien.idHocVien);
      res.locals.nItem = nItems[0]
    }
     next();
   }),
  app.use(async function (req, res, next) {
    const rows = await categoryModel.allWithDetails();
    for (var i = 0;i<rows.length;i++){
      var obj = await categoryModel.detailCateg(rows[i].idLinhVuc)
      var numCourses =[]
      if(obj!== null){
        for (var j=0;j<obj.length;j++){
          var courses = JSON.parse(JSON.stringify(await categoryModel.numOfCourses(obj[j].idLinhVucCap2)))
         numCourses.push(courses[0].SoLuongKhoaHoc)
        }
      }
     
      var final = JSON.parse(JSON.stringify(await categoryModel.detailCateg(rows[i].idLinhVuc))) 
     rows[i].level2 = final
     rows[i].nCourses = numCourses;
    }

    res.locals.lcCategories = rows;
    next();
  }),

  app.use(async function (req, res, next) {    
    
    if (req.session.cart === undefined){
      req.session.cart = [];
      res.locals.nCart = 0;
        }
    else{
      res.locals.nCart = req.session.cart.length;
    }
    //req.session.cart = []

    next();
  })
  
}