const db = require('../utils/db');
const TBL_USERS = 'giangvien';
module.exports = {

    all() {
        return db.load(`select * from ${TBL_USERS}`);
      },
    
    async single(id) {
    const rows = await db.load(`select * from ${TBL_USERS} where idGiangVien = ${id}`);
    if (rows.length === 0)
        return null;

    return rows[0];
    },
    async singleByidTaiKhoan(idTaiKhoan) {
        const rows = await db.load(`select *, TIMESTAMPDIFF(year,NgaySinh, now() )  as Tuoi from ${TBL_USERS} where TaiKhoan_idTaiKhoan = ${idTaiKhoan} and TrangThai=1`);
        if (rows.length === 0)
          return null;
    
        return rows[0];
      },
    add(entity) {
    return db.add(entity, TBL_USERS)
    },
    update(newName, idGiangVien, attribute) {
        const sql = `
        update ${TBL_USERS} set ${attribute} = '${newName}' where idGiangVien = ${idGiangVien}
        `;
        return db.load(sql);
      },
    async singleByEmail(Email){
      const sql = `
      select * from ${TBL_USERS}
      where Email ='${Email}'
      `;
      return db.load(sql);
    },

    async getIdbyAcccount(idAcc)
    {
      return db.load(`select gv.idGiangVien from giangvien gv where gv.TaiKhoan_idTaiKhoan=${idAcc}`)
    }
}


