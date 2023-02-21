const db = require('../utils/db');
module.exports={
    async courseAuth(idHocVien,idKhoaHoc){
        const check = await db.load(`select * from hocvien_mua_khoahoc where HocVien_idHocVien = ${idHocVien} and KhoaHoc_IdKhoaHoc = ${idKhoaHoc}`);

        if(check.length === 0){
            return false;
        };
        return true;
    },
    async checkTeacher(TenTaiKhoan) {
        const rows = await db.load(`select *, cast(t.MatKhau as char) AS MatKhau 
        from giangvien g, taikhoan t
        where t.TenTaiKhoan = '${TenTaiKhoan}' and g.TaiKhoan_idTaiKhoan = t.idTaiKhoan and t.TrangThai=1`);
        if (rows.length === 0)
            return null;
        return rows[0];
        },
    async checkAdmin(TenTaiKhoan) {
        const rows = await db.load(`select *,cast(MatKhau as char) AS MatKhau from taikhoan where TenTaiKhoan = '${TenTaiKhoan}' and LoaiTaiKhoan = 0 and TrangThai=1`);
        if (rows.length === 0)
            return null;
        return rows[0];
        },
    async setAuth(IdTaiKhoan,TrangThai) {
        return await db.load(`update taikhoan set TrangThai = ${TrangThai} where idTaiKhoan = ${IdTaiKhoan}`)
        },
}