var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes = function () {
    // GET Debtors
    router.route('/')
        .get(function (req, res) {

            // Pagination
            var page = parseInt(req.query.page, 10);
            if (isNaN(page) || page < 0) {
                page = 0;
              }
            var limit = parseInt(req.query.limit, 10);
              if (isNaN(limit)) {
                limit = 10;
            } else if (limit < 0) {
                limit = 10;
            }
            var offset = page * limit;
            // SQL QUERY
            var sqlQuery = "SELECT * FROM [dbo].[DR_ACCS] ORDER BY ACCNO";
            if (limit != 0) {
                sqlQuery += " OFFSET " + offset + " ROWS FETCH NEXT " + limit + " ROWS ONLY";
            }
            // End Pagination

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

    router.route('/:id([0-9]+)')
        .get(function (req, res) {
            var _productID = req.params.id
            

            conn.connect().then(function () {
                var sqlQuery = "SELECT * FROM [dbo].[DR_ACCS] WHERE ACCNO = " + _productID;
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