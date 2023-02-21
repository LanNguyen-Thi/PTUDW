const exphbs  = require('express-handlebars');
const numeral = require('numeral');
var hbs_sections = require('express-handlebars-sections');
module.exports = function (app) {
    app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        extname: '.hbs',
        layoutsDir: 'views/_layouts',
        partialsDir: 'views/_partials',
        helpers: {
            section: hbs_sections(),
            format(val) {
              return numeral(val).format('0,0');
            },
            create_UUID(){
              var dt = new Date().getTime();
              var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                  var r = (dt + Math.random()*16)%16 | 0;
                  dt = Math.floor(dt/16);
                  return (c=='x' ? r :(r&0x3|0x8)).toString(16);
              });
              return uuid;
          }
          },
        
    }));
    app.set('view engine', 'hbs');
}
