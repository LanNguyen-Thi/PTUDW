var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '123456',
	database: 'mydb'
};

var sessionStore = new MySQLStore(options);

module.exports = function (app) {
    app.use(session({
        secret: 'Its a secret',
        resave: false,
        store: sessionStore,
        saveUninitialized: true,
        cookie: { secure: false },
        charset: 'utf8',
	schema: {
		tableName: 'sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data'
		}
	}
      }));
    app.use(function(req,res,next){ //Dùng để khởi tạo các biến cho session
        req.session.adminAuth=false;    
       // req.session.cart = []
     //   req.session.accounttype=false;
        next();//Sẽ chạy xuống và tiếp tục tìm các đường dẫn phù hợp với đường nhẫn nhập vào
    }
    );
}
