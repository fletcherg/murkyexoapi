var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes = function () {
    // GET Invoices
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
             var months = parseInt(req.query.months, 10);
               if (isNaN(months)) {
                months = 12;
             } else if (months <= 0) {
                months = 12;
             }
             var offset = page * limit;
             // SQL QUERY This will only return the last years worth of data
             var sqlQuery = `SELECT
             [SEQNO] as 'InvoiceLineId',
             [TRANSDATE] as 'TransactionDate',
             [ACCNO] as 'AccountNumber',
             [INVNO] as 'InvoiceNumber',
             [STOCKCODE] as 'StockCode',
             [DESCRIPTION] as 'Description',
             [QUANTITY] as 'Qty'     ,
             [UNITPRICE] as 'UnitPrice',
             [UNITPRICE_INCTAX] as 'UnitPriceInclTax',
             [CURRENCYNO] as 'CurrencyNo',
             [EXCHRATE] as 'ExchRate',
             [LINETOTAL] as 'Total',
             [LINETOTAL_INCTAX] as 'TotalIncTax',
             [LineTotal] * 1 / [EXCHRATE] as 'LineTotalNZD',
             [LineTotal_IncTax] * 1 / [EXCHRATE] as 'LineTotalIncTaxNZD',
             [NUNITPR]
         FROM [dbo].[DR_INVLINES]`;
         sqlQuery += "WHERE TRANSDATE > DATEADD(month,-" + months + ",GETDATE()) ORDER BY INVOICELINEID DESC";
         
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