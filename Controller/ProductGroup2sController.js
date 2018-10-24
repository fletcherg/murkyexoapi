var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes = function () {
    // GET ProductGroups
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
             var sqlQuery = `
SELECT 
g.[GROUPNO] as GroupId
      ,g.[GROUPNAME] as GroupName
      ,g.[Status] as Status
  FROM [dbo].[STOCK_GROUP2S] g
ORDER BY g.groupno`;

//SELECT g.[GROUPNO] as GroupId      ,g.[GROUPNAME] as GroupName      ,g.[GROUP2_SEQNO] as GroupCategoryId	  ,m.groupname as GroupCategory      ,g.[SALES_GL_CODE] as Sales_GL_Code
//      ,g.[PURCH_GL_CODE] as Purch_GL_Code      ,g.[COS_GL_CODE] as Cos_GL_Code      ,g.[ISACTIVE] as IsActive  FROM [dbo].[STOCK_GROUPS] g  JOIN [dbo].[STOCK_GROUP2S] m   ON g.GROUP2_SEQNO = m.groupno ORDER BY g.groupno
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