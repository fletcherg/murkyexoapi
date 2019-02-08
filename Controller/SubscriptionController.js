var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes = function () {
    // GET Subscriptions
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
             // SQL QUERY MUAHAHAHAHAHAHHHAH
             var sqlQuery = `SELECT l.SEQNO as SubscriptionID, h.accno as AccountNumber, h.is_active as IsActive, h.X_PROSPECTSEQNO as NonAccountNumber,
                h.X_USERACCOUNTVIEW as X_UserAccountView, l.STOCK_CODE as StockCode, l.DESCRIPTION as Description, l.X_LONGDESCRIPTION as DescriptionDetail,
                l.Qty, l.UnitPrice, l.Total
                FROM [dbo].[SUBS_LINE] l
                JOIN [dbo].[SUBS_HDR] h ON l.HDR_SEQNO = h.SEQNO
                ORDER BY ACCNO`;
            if (limit != 0) {
                   sqlQuery += " OFFSET " + offset + " ROWS FETCH NEXT " + limit + " ROWS ONLY";
            }
            // End Pagination

            conn.connect().then(function () {
                var req = new sql.Request(conn);
                req.query(sqlQuery).then(function (recordset) {
                    res.json(recordset.recordset);
                    // FUCK THE POLICE
                    //res.set('Content-Type', 'text/xml');
                    //res.send(xml(recordset.recordset));
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