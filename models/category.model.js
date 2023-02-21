const db = require('../utils/db');
module.exports = {

    add(entity, CategType) {
        if (CategType == 1) {
            return db.add(entity, 'LinhVucCap1')
        } else if (CategType == 2) {
            return db.add(entity, 'LinhVucCap2')
        }

    },
    async detailCateg2(idLinhVucCap2) {
        const rows = await db.load(`
        select *
                from  linhvuccap2
                where idLinhVucCap2 = ${idLinhVucCap2}`);
        if (rows.length === 0) { return null; }


        return rows[0];
    },
    async updateCateg2(entity, condition) {
        return db.patch(entity, condition, 'LinhVucCap2')
    },
    async deleteCateg2(condition) {
        return db.del(condition,'LinhVucCap2')
    },



}