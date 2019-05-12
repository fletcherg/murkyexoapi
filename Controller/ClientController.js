var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes = function () {
    // GET Clients
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
            var sqlQuery = `SELECT [SEQNO] as NonAccountNumber
                  ,COALESCE(d.[ACCNO],p.[DRACCNO]) as DebtorAccountNumber
                  ,COALESCE(d.[ISACTIVE],d.[ISACTIVE]) as IsActive
                  ,COALESCE(d.[X_EXTERNALID],p.[X_EXTERNALID]) as X_EXTERNALID
                  ,COALESCE(d.NAME, p.name) as AccountName
                  ,COALESCE(d.[PHONE], p.[PHONE]) as Phone
                  ,COALESCE(d.[FAX], p.[FAX]) as Fax
                  ,COALESCE(d.[EMAIL], p.[EMAIL]) as Email
                  --,COALESCE(d.[WEBSITE], p.[WEBSITE]) as Website
                  ,COALESCE(d.[ADDRESS1], p.[ADDRESS1]) as BillingAddress1
                  ,COALESCE(d.[ADDRESS2], p.[ADDRESS2]) as BillingAddress2
                  ,COALESCE(d.[ADDRESS3], p.[ADDRESS3]) as BillingAddress3
                  ,COALESCE(d.[ADDRESS4], p.[ADDRESS4]) as BillingAddress4
                  ,COALESCE(d.[ADDRESS5],p.[ADDRESS5]) as BillingAddress5
                  ,COALESCE(d.[POST_CODE], p.[POST_CODE]) as BillingPostCode
                  ,COALESCE(d.[DELADDR1],p.[DELADDR1]) as DeliveryAddress1
                  ,COALESCE(d.[DELADDR2],p.[DELADDR2]) as DeliveryAddress2
                  ,COALESCE(d.[DELADDR3],p.[DELADDR3]) as DeliveryAddress3
                  ,COALESCE(d.[DELADDR4],p.[DELADDR4]) as DeliveryAddress4
                  ,COALESCE(d.[DELADDR5],p.[DELADDR5]) as DeliveryAddress5
                  ,COALESCE(d.[DELADDR6],p.[DELADDR6]) as DeliveryAddress6
                  ,COALESCE(d.[NOTES],p.[NOTES]) as Notes
                  ,COALESCE(d.[PRICENO],p.[PRICENO]) as PriceNo
                  ,COALESCE(d.[SALESNO],p.[SALESNO]) as SalesNo
                  ,p.[PROSPECT_TYPE] as NonAccount_ProspectType
                  --,p.[CRACCNO] as NonAccount_CRACCNO
                  ,COALESCE(d.[ALPHACODE],p.[ALPHACODE]) as AlphaCode
                  ,COALESCE(d.[LAST_UPDATED],p.[LAST_UPDATED]) as LastUpdated
                  --,p.[DRACC_TEMPLATE] as NonAccount_DRACCTemplate
                  --,COALESCE(d.[LINKEDIN],p.[LINKEDIN]) as LinkedIn
                  --,COALESCE(d.[TWITTER],p.[TWITTER]) as Twitter
                  --,COALESCE(d.[FACEBOOK],p.[FACEBOOK]) as Facebook
                  --,p.[CAMPAIGN_WAVE_SEQNO] as NonAccount_CampaignWaveSeqNo
                  --,COALESCE(d.[LATITUDE],p.[LATITUDE]) as Latitude
                  --,COALESCE(d.[LONGITUDE],p.[LONGITUDE]) as Longitude
                  --,COALESCE(d.[GEOCODE_STATUS],p.[GEOCODE_STATUS]) as GeocodeStatus
                  --,p.[X_PARTNERACCNO] as Prospect_X_PartnerACCNO
                  --,p.[X_DRACCOUNT] as Prospect_X_DRACCOUNT
                  ,p.[X_CRACCNO_INT] as Prospect_X_CRACCNO_INT
                  --,p.[X_DRACCNO_INT] as Prospect_X_DRACCNO_INT
                  ,COALESCE(d.[X_REASONFORLEAVING],p.[X_REASONFORLEAVING]) as X_REASONFORLEAVING
                  ,COALESCE(d.[X_LEAVINGDATE],p.[X_LEAVINGDATE]) as X_LEAVINGDATE
                  ,COALESCE(d.[X_LEAVINGDESCRIPTION],p.[X_LEAVINGDESCRIPTION]) as X_LEAVINGDESCRIPTION
                  ,COALESCE(d.[X_RELATIONSHIPTYPE],p.[X_RELATIONSHIPTYPE]) as X_RELATIONSHIPTYPE
                  ,COALESCE(d.[X_BUSINESSPARTNER],p.[X_BUSINESSPARTNER]) as X_BUSINESSPARTNER
                  ,p.name as NonAccount_Name
            FROM [dbo].[PROSPECTS] p
            FULL OUTER JOIN [dbo].[DR_ACCS] d
            ON p.DRACCNO = d.ACCNO
            WHERE p.SEQNO IS NOT NULL
            ORDER BY SEQNO`;
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

    return router;
};
module.exports = routes;