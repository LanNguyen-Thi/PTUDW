const db = require('../utils/db');

module.exports = {
    all(){
        return db.load(`select k.*,DATE_FORMAT(k.NgayCapNhat, "%M %d %Y") as LastUpdate, g.TenGiangVien, l.TenLinhVuc as ChuDe
        from khoahoc k, giangvien g, linhvuccap2 l
        where g.idGiangVien = k.NguoiDay and l.idLinhVucCap2 = k.LinhVuc and k.HienThi=1`);
    },
    infoCourses() {
        const sql = `
        select k.*, g.TenGiangVien
        from giangvien g, khoahoc k
        where g.idGiangVien = k.NguoiDay and  k.HienThi=1
        `;
        return db.load(sql);
      },
    allWithDetails() {
    const sql = `select lv1.idLinhVuc, lv1.TenLinhVuc, count(lv1.idLinhVuc) as soLV
    from linhvuccap1 lv1 left join linhvuccap2 lv2 on lv1.idLinhVuc = lv2.LinhVucCap1_idLinhVuc
    group by lv1.idLinhVuc, lv1.TenLinhVuc`;
    return db.load(sql);
    },
    singleByCateg1(idLinhVucCap1) {
      const sql = `select lv1.idLinhVuc, lv1.TenLinhVuc, count(lv1.idLinhVuc) as soLV
      from linhvuccap1 lv1, linhvuccap2 lv2
      where lv1.idLinhVuc = lv2.LinhVucCap1_idLinhVuc and lv1.idLinhVuc = ${idLinhVucCap1}`;
      return db.load(sql);
      },
    async detailCateg(idLinhVucCap2) {
        const rows = await db.load(`select lv2.idLinhVucCap2, lv2.TenLinhVuc as TenLinhVucCap2
        from  linhvuccap2 lv2
        where lv2.LinhVucCap1_idLinhVuc = ${idLinhVucCap2}`);
        if (rows.length === 0)
          return null;
    
        return rows;
      },
      async checkNewest(IdKhoaHoc) {
        const rows = await db.load(`select * from khoahoc k1
        where k1.IdKhoaHoc = ${IdKhoaHoc} and k1.HienThi=1 and exists(SELECT IdKhoaHoc
            FROM khoahoc k inner join giangvien g on k.NguoiDay = g.idGiangVien inner join linhvuccap2 l on l.idLinhVucCap2 = k.LinhVuc
            where k.IdKhoaHoc = k1.IdKhoaHoc and k.HienThi=1
            ORDER BY DATE(NgayCapNhat) DESC
            LIMIT 10)`);
        if (rows.length === 0)
          return false;
    
        return true;
      },
      async checkBestSeller(IdKhoaHoc) {
        const rows = await db.load(`select * from khoahoc k1
        where k1.IdKhoaHoc = ${IdKhoaHoc} and k1.HienThi=1 and exists(SELECT IdKhoaHoc
            FROM khoahoc k inner join giangvien g on k.NguoiDay = g.idGiangVien inner join linhvuccap2 l on l.idLinhVucCap2 = k.LinhVuc
            where k.IdKhoaHoc = k1.IdKhoaHoc and k.HienThi=1
            ORDER BY SoLuotXem DESC
            LIMIT 10)`);
        if (rows.length === 0)
          return false;
    
        return true;
      },
    async courseByCateg(idLinhVucCap2) {
    const rows = await db.load(`select k.*, g.TenGiangVien, k.HocPhi*(1-k.KhuyenMai) as giaMoi, l.TenLinhVuc as ChuDe, COUNT(*) OVER() as  SoKhoaHoc
    from khoahoc k, giangvien g, linhvuccap2 l
    where g.idGiangVien = k.NguoiDay and k.LinhVuc = ${idLinhVucCap2} and l.idLinhVucCap2 = k.LinhVuc and k.HienThi=1
    group by k.IdKhoaHoc`);
    if (rows.length === 0)
        return null;
    return rows;
    },
    async numOfCourses(idLinhVucCap2) {
      const rows = await db.load(`select count(*) as SoLuongKhoaHoc
      from khoahoc k
      where k.LinhVuc =  ${idLinhVucCap2} and k.HienThi=1`);
      if (rows.length === 0)
          return null;
      return rows;
      }
    ,
    async addCourse(entity) {
      return db.add(entity, 'KhoaHoc')
    },
    async addChapter(entity) {
      return db.add(entity, 'ChuongKhoaHoc')
    },
    async addLesson(entity) {
      return db.add(entity, 'BaiHoc')
    },
    async addVideo(entity) {
      return db.add(entity, 'Video')
    },
    lastIdCourse() {
      const sql = `select IdKhoaHoc from KhoaHoc ORDER BY IdKhoaHoc DESC LIMIT 1`;
    const lastid = db.load(sql);
    if (lastid.length === 0)
          return 1;
    return lastid;
      }
    ,
    lastIdChapter() {
      const sql = `select idChuongKhoaHoc from ChuongKhoaHoc ORDER BY idChuongKhoaHoc DESC LIMIT 1`;
    const lastid = db.load(sql);
    if (lastid.length === 0)
          return 1;
    return lastid;
      }
    ,
    lastIdLesson() {
      const sql = `select idBaiHoc from BaiHoc ORDER BY idBaiHoc DESC LIMIT 1`;
    const lastid = db.load(sql);
    if (lastid.length === 0)
          return 1;
    return lastid;
      }
    ,
    async allCateg2() {
      const rows = await db.load(`select * from linhvuccap2`);
      if (rows.length === 0)
          return null;
      return rows;
      }
    ,
    async deleteCourse(IdKhoaHoc) {
      return await db.load(`delete from khoahoc where IdKhoaHoc = ${IdKhoaHoc}`);
      }
    ,
    async approveCourse(HienThi, IdKhoaHoc) {
      return await db.load(`update khoahoc set HienThi = ${HienThi} where IdKhoaHoc = ${IdKhoaHoc}`);
      }
    ,
    async allByTeacher(idGiangVien) {
      const rows = await db.load(`select k.*,DATE_FORMAT(k.NgayCapNhat, "%M %d %Y") as LastUpdate, g.TenGiangVien, l.TenLinhVuc as ChuDe
      from khoahoc k, giangvien g, linhvuccap2 l
      where g.idGiangVien = k.NguoiDay and l.idLinhVucCap2 = k.LinhVuc and NguoiDay = ${idGiangVien} and k.HienThi=1`);
      if (rows.length === 0)
          return null;
      return rows;
      }
    ,
    async update(entity,conditon,table) {
     return db.patch(entity,conditon,table)
      }
    ,
    async getbylimited(number)
    {
      var numberOfRow=number*20;
      var beginnum=numberOfRow-20;
      return(db.load(
        `SELECT * FROM khoahoc LIMIT ${beginnum},${numberOfRow}`
      ));
    }
    ,
    async getNumberofKH()
    {
      return(db.load(`select count(k.idKhoaHoc) as soluong from khoahoc k where k.HienThi=1`))
    }
    ,

    

    
}

