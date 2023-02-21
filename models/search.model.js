const db = require('../utils/db');

module.exports = {

    all(searchText) {
    const sql = `SELECT k.*, g.TenGiangVien, round(k.HocPhi*(1-k.KhuyenMai),2) as giaMoi, l.TenLinhVuc as ChuDe, COUNT(*) OVER() as  SoKhoaHoc
    FROM KhoaHoc k, GiangVien g, LinhVucCap2 l
    WHERE g.idGiangVien = k.NguoiDay and k.LinhVuc = l.idLinhVucCap2 and MATCH(TenKhoaHoc) AGAINST('${searchText}' IN NATURAL LANGUAGE MODE) `;
    return db.load(sql);
    },
    ascPrice(searchText){
        const sql = `SELECT k.*, g.TenGiangVien, round(k.HocPhi*(1-k.KhuyenMai),2) as giaMoi, l.TenLinhVuc as ChuDe, COUNT(*) OVER() as  SoKhoaHoc
        FROM KhoaHoc k, GiangVien g, LinhVucCap2 l
        WHERE g.idGiangVien = k.NguoiDay and k.LinhVuc = l.idLinhVucCap2 and MATCH(TenKhoaHoc) AGAINST('${searchText}' IN NATURAL LANGUAGE MODE)
        ORDER BY giaMoi ASC  `;
        return db.load(sql);
    },
    descRating(searchText){
        const sql = `SELECT k.*, g.TenGiangVien, round(k.HocPhi*(1-k.KhuyenMai),2) as giaMoi, l.TenLinhVuc as ChuDe, COUNT(*) OVER() as  SoKhoaHoc
        FROM KhoaHoc k, GiangVien g, LinhVucCap2 l
        WHERE g.idGiangVien = k.NguoiDay and k.LinhVuc = l.idLinhVucCap2 and MATCH(TenKhoaHoc) AGAINST('${searchText}' IN NATURAL LANGUAGE MODE)
        ORDER BY DiemDanhGia DESC `;
        return db.load(sql);
    }
   
}

