const express = require('express');
const accountModel = require('../models/account.model');
const router = express.Router();
const teacherModel = require('../models/teacher.model')
const crypt = require('bcryptjs')
const fs = require('fs');
const adminAuth = require('../middleware/adminAuth.mdw')
const courseModel = require('../models/courses.model');
const userModel=require('../models/user.model');
const categoryModel = require('../models/category.model');
const nodemailer =  require('nodemailer');
const authModel = require('../models/auth.model');

router.get('/allcategories', adminAuth, async function(req, res) {
    res.render('admin/categories/allcategories');

});

router.get('/addcategories', adminAuth, async function(req, res) {
    res.render('admin/categories/addcategories');

});


router.get('/detailcategories', adminAuth, async function(req, res) {

    res.render('admin/categories/detailcategories');

});
router.get('/allcategories/edit/:id', adminAuth, async function(req, res) {
    const id = req.params.id

    const Categ2 = await categoryModel.detailCateg2(id);
    Categ2.SoKhoaHoc = JSON.parse(JSON.stringify(await courseModel.numOfCourses(id)))[0].SoLuongKhoaHoc
    console.log(Categ2)
    res.render('admin/categories/editcategories', {
        Categ2: Categ2
    });

});
router.get('/allcourses', adminAuth, async function(req, res) {
    const allCourse = await courseModel.all()

    res.render('admin/courses/allcourses'/*, {
        allCourses: allCourse
    }*/);


});
router.get('/detail-course', adminAuth, async function(req, res) {

    res.render('admin/courses/allcourses');

});

router.get('/add-teacher', adminAuth, function(req, res) {
    
    res.render('admin/user-management/addteacher')
})


router.get('/allusers',adminAuth, async function (req, res) {
        const allUsers = await userModel.all()
        console.log(allUsers)
        res.render('admin/user-management/allusers',{
                allUsers: allUsers
        });
        // res.render('admin/user-management/allusers');
});





router.post('/deleteCourse', async function(req, res) {

    const IdKhoaHoc = +req.body.IdKhoaHoc
    await courseModel.deleteCourse(IdKhoaHoc)
    res.redirect('/admin/allcourses')
})

router.post('/approveCourse', async function(req, res) {

    const IdKhoaHoc = +req.body.IdKhoaHoc
    const HienThi = +req.body.HienThi
    console.log(IdKhoaHoc,HienThi)
    if(HienThi == 1){
        await courseModel.approveCourse(0,IdKhoaHoc)
    }
    else{
        await courseModel.approveCourse(1,IdKhoaHoc)
    }
    res.redirect('/admin/allcourses')
})

router.post('/acceptAuth', async function(req, res) {
    const idTaiKhoan = +req.body.IdTaiKhoan
    const TrangThai = +req.body.TrangThai
    if(TrangThai == 1){
        await authModel.setAuth(idTaiKhoan,0)
    }
    else{
        await authModel.setAuth(idTaiKhoan,1)
    }
    res.redirect('/admin/allusers')
})
router.post('/deleteAcc', async function(req, res) {
    const idTaiKhoan = +req.body.IdTaiKhoan
    await accountModel.deleteAccount({idTaiKhoan:idTaiKhoan})
    res.redirect('/admin/allusers')
})
router.post('/createAcc', async function(req, res) {
    const username = req.body.username
    const password = req.body.password
    var account = { 
        idTaiKhoan:null, 
        TenTaiKhoan: username,
        MatKhau: await crypt.hash(password, 10),
        Salt: null,
        LoaiTaiKhoan: 2,
        TrangThai:1 }
    console.log(account)
    await accountModel.addAccount(account)
    var idtaikhoan = (await userModel.lastId())[0].idTaiKhoan
   console.log("IdTaiKhoan",idtaikhoan)
    var teacher = {
        IdGiangVien: null,
        TenGiangVien: null,
        NgaySinh: null,
        Mota: null,
        HinhDaiDien: null,
        Email: null,
        TaiKhoan_idTaiKhoan: idtaikhoan
    };
    teacherModel.add(teacher);

    res.render('admin/user-management/addteacher',{
        username: username,
        password: password
    })
})


router.post('/allcategories/edit', async function(req, res) {

    const idLinhVucCap1 = +req.body.category
    const TenLinhVuc = req.body.LinhVucCap2
    const updateLv = {
        MaLinhVuc: null,
        TenLinhVuc: TenLinhVuc,
        LinhVucCap1_idLinhVuc: idLinhVucCap1
    }
    const condition = {
            idLinhVucCap2:+req.body.idLinhVucCap2
        }
        await categoryModel.updateCateg2(updateLv, condition);
    res.redirect('/admin/allcategories')

})
router.post('/allcategories/delete', async function(req, res) {

    const condition = {
            idLinhVucCap2:+req.body.idLinhVuc
        }
        await categoryModel.deleteCateg2(condition)
    res.redirect('/admin/allcategories')

})

router.post('/addCategory', function(req, res) {
    const categ = req.body.category
    if (categ == 'lv1') {
        const TenLv = req.body.lv1lv1;
        const Categ1 = {
            idLinhVuc: null,
            MaLinhVuc: null,
            TenLinhVuc: TenLv
        }
        categoryModel.add(Categ1, 1)
    } else {
        const categ2 = {
            idLinhVucCap2: null,
            MaLinhVuc: null,
            TenLinhVuc: req.body.lv2lv2,
            LinhVucCap1_idLinhVuc: +req.body.lv2lv1,
        }
        categoryModel.add(categ2, 2)

    }
    res.redirect('/admin/addcategories')
})
router.get('allcourses/:number',async function(req,res)
  {
    res.json( await courseModel.getbylimited(req.body.number));
  })
module.exports = router;
router.post('/slkh',async function(req,res)
  {
    var sl=await courseModel.getNumberofKH();
    console.log(sl[0].soluong);
    res.json({slkh:sl[0].soluong});
  })