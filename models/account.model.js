const db = require('../utils/db');
const { getIdbyAcccount } = require('./teacher.model');
const TBL_USERS = 'taikhoan';
module.exports={
    async accountExistence(account){
        const rows = db.load(`select tk.loaitaikhoan from ${TBL_USERS} tk where tk.tentaikhoan= '${account}'`);
        if(rows === null){
            return false;
        }
        return true;
    },
    async getPassword(account){
        const rows = db.load(`select tk.matkhau,tk.loaitaikhoan from ${TBL_USERS} tk where tk.tentaikhoan= '${account}'`);
        if(rows === null){
            return false;
        }
        return true;
    },
    async addAccount(account)
    {
       return  db.add(account,TBL_USERS)
        
    },
    async getIdbyAcccount(account)
    {
        return db.load(`select tk.idtaikhoan from taikhoan tk where tk.tentaikhoan='${account}'`)
    },
    async deleteAccount(condition)
    {
        return db.del(condition,'taikhoan')
    }
}