var sql = require('mssql');
//const sql = require("mssql/msnodesqlv8");

var config = {
    user: 'sa',
    password: 'orbitz',
    server: 'orbits-9', 
    database: 'ProjectManagent' 
};

// const config = {
//     server: "admin9",
//     database: "ProjectManagent",
//     driver: "msnodesqlv8",
//     options: {
//       trustedConnection: true
//     }
//   };

sql.connect(config, function (err) {

    if (err) console.log(err);

});

module.exports=sql;