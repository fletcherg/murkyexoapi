var express = require('express');
var app = express();
var morgan = require('morgan');
var winston = require('./configuration/winston');
//var jwt = require('jsonwebtoken');
//var compression = require('compression');
const config = require('./configuration/config');

const basicAuth = require('express-basic-auth')
 
app.use(basicAuth({
    users: config.auth.basicauth.users,
    unauthorizedResponse: getUnauthorizedResponse
}))

var port = process.env.port || config.app.port;

//app.use(logger('dev'));
app.use(morgan('combined', { stream: winston.stream }));

//app.use(compression);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    var token = req.headers['x-myobapi-exotoken'];
    // this is not really JWT. LOLOLOLOL. Because we don't know the EXO secret. We do it shitilly.
    if (config.auth.APITokens.includes(token)) {
        next();
      } else {
        res.send({ 
            message: 'Wrong API token provided' 
        })
      }
});

var fatController = require('./Controller/FatController')();
//var productController = require('./Controller/ProductController')();
var SubscriptionController = require('./Controller/SubscriptionController')();
//var DebtorController = require('./Controller/DebtorController')();
//var NonAccountController = require('./Controller/NonAccountController')();
var StatusController = require('./Controller/StatusController')();

app.use("/fat", fatController);
//app.use("/products", productController);
app.use("/subscriptions", SubscriptionController);
//app.use("/debtors", DebtorController);
//app.use("/NonAccounts", NonAccountController);
app.use("/status", StatusController);

app.use(function(req, res){
    res.send({ 
        message: 'Murky EXO API 1.0.2'
    })
});

app.listen(port, function () {
    var datetime = new Date();
    var message = datetime + " - MurkyExoAPI Server now runnning on Port:- " + port;
    winston.info (message);
    console.log(message);
});

function getUnauthorizedResponse(req) {
    return req.auth
        ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
        : {"Status" : "You need to parse credentials, foo!!"}
}

//logger.info ('App Started!');
