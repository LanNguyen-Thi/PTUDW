const db = require('../utils/db');

module.exports = {

    async topNewCourses() {
    const rows = await db.load(`SELECT *, round(k.HocPhi*(1-k.KhuyenMai),2) as giaMoi
    FROM khoahoc k inner join giangvien g on k.NguoiDay = g.idGiangVien inner join linhvuccap2 l on l.idLinhVucCap2 = k.LinhVuc
    ORDER BY DATE(NgayCapNhat) DESC
    LIMIT 10`);
    if (rows.length === 0)
        return null;
    return rows;
    },
    async topViewersCourses() {
        const rows = await db.load(`SELECT a.* FROM (SELECT k.*,g.idgiangvien,g.TenGiangVien,g.ngaysinh,g.MoTa,g.hinhdaidien hinhdaidiengv,g.Email,g.TaiKhoan_idTaiKhoan,l.*, round(k.HocPhi*(1-k.KhuyenMai),2) as giaMoi
        FROM khoahoc k inner join giangvien g on k.NguoiDay = g.idGiangVien inner join linhvuccap2 l on l.idLinhVucCap2 = k.LinhVuc
        LIMIT 10) a
        ORDER BY a.SoLuotXem DESC`);
        if (rows.length === 0)
            return null;
        return rows;
        },
    async topTopic() {
        const rows = await db.load(`SELECT * FROM (select *, count(h.HocVien_idHocVien) as SoHVDangKi, count(k.IdKhoaHoc) as SoKhoaHoc
        from khoahoc k inner join linhvuccap2 l on l.idLinhVucCap2 = k.LinhVuc inner join hocvien_mua_khoahoc h on h.KhoaHoc_IdKhoaHoc = k.IdKhoaHoc
        where DATEDIFF(CURDATE(),h.NgayDangKy )<=7
        group by l.idLinhVucCap2
		  LIMIT 8) a
        ORDER BY a.sohvdangki`);
        if (rows.length === 0)
            return null;
        return rows;
        },
    async topCourseInWeek() {
        const rows = await db.load(`select k.IdKhoaHoc, k.TenKhoaHoc, round((sum(d.Diem)/count(*)),1) as DTB, l.TenLinhVuc as ChuDe, g.TenGiangVien, k.DiemDanhGia
        from hocvien_danhgia_khoahoc d, khoahoc k, linhvuccap2 l, giangvien g
        where d.KhoaHoc_IdKhoaHoc = k.IdKhoaHoc and DATEDIFF(CURDATE(),d.NgayDanhGia)<=7 and k.LinhVuc = l.idLinhVucCap2
        and g.idGiangVien = k.NguoiDay
        group by k.IdKhoaHoc
        order by DTB DESC
        Limit 4
        `);
        if (rows.length === 0)
            return null;
        return rows;
        }

    
}
