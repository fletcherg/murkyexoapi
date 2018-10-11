var sql = require("mssql");
const config = require('../configuration/config');
var connect = function()
{
    var conn = new sql.ConnectionPool(config.db);
 
    return conn;
};

module.exports = connect;
