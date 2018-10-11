var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes = function () {
    // GET Subscriptions
    router.route('/')
        .get(function (req, res) {

             var sqlQuery = `SELECT NAME as Connected from sys.databases where database_id = db_id()`;            
            
            conn.connect().then(function () {
                var req = new sql.Request(conn);
                req.query(sqlQuery).then(function (recordset) {
                    res.json(recordset.recordset);
                    conn.close();
                })
                    .catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while querying data");
                    });
            })
                .catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while querying data");
                });
        });

    return router;
};
module.exports = routes;