var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes = function () {
    router.route('/')
        .get(function (req, res) {
            conn.connect().then(function () {
                var sqlQuery = "SELECT * FROM [dbo].[PROSPECTS]";
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