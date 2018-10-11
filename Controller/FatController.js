var express = require('express');
var router = express.Router();


/*
router.use((req, res, next) =>{
    var token = req.headers['x-myobapi-exotoken'];
    // decode token
      // verifies secret and checks if the token is expired
      if (token == "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTkyMTc2MDAsImlzcyI6IlMtMS01LTIxLTI2NDg0MTI1NjYtMTM0OTk1NDI3Mi03NjkxOTE0MDo1SzJXcGFjQm5NZnNQMWlBeG80QnV3PT0iLCJhdWQiOiJodHRwczovL2V4by5hcGkubXlvYi5jb20vIiwibmFtZSI6IkVYT0FQSSIsInN0YWZmbm8iOiI1NiIsImFwcGlkIjoiNDQwMCJ9.HsdzopyR0DJv1J2R5kmvaoqA76AOrMwyYJ9eXwgn9NA") {
        //req.decoded = decoded;    
        next();
      } else {
        res.send({ 
            message: 'Wrong API token provided' 
        })
      }
  });
  */

var routes = function () {
    // GET fat controller
    router.route('/')
        .get(function (req, res) {

            //res.json({"Pie status" : "There are no pies here"});
            res.json(JSON.stringify(req.headers));
            
        });
    return router;
};
module.exports = routes;