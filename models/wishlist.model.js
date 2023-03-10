const db = require('../utils/db');
module.exports = {
    async all(idHocVien){
        return db.load(`select *,DATE_FORMAT(k.NgayCapNhat, "%M %d %Y") as LastUpdate, round(k.HocPhi*(1-k.KhuyenMai),2) as giaMoi 
        from khoahoc k, hocvien h, hocvien_yeuthich_khoahoc l, giangvien g
        where k.IdKhoaHoc = l.KhoaHoc_IdKhoaHoc and h.idHocVien = l.HocVien_idHocVien and g.idGiangVien = k.NguoiDay and h.idHocVien = ${idHocVien}`);
    },
    //Số khóa học trong wishlish
    async nItem(idHocVien){
        return db.load(`select count(*) as SoKhoaHocWishList
        from hocvien h, hocvien_yeuthich_khoahoc l
        where h.idHocVien = l.HocVien_idHocVien and h.idHocVien =${idHocVien}
        group by h.idHocVien`);
    },
    async remove(idHocVien,IdKhoaHoc,TBL){
        return db.load(`delete from ${TBL} where HocVien_idHocVien = ${idHocVien} and KhoaHoc_idKhoaHoc = ${IdKhoaHoc}`);
    },
    async add(idHocVien,IdKhoaHoc,TBL){
        return db.load(`insert ignore into ${TBL} VALUES (${idHocVien},${IdKhoaHoc})`);
    },
    
    
}

