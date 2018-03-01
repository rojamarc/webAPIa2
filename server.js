var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');

var app = express();
app.use(bodyParser.text({
        type: function(req) {
            return 'text';
        }
}));

app.use(passport.initialize());

var router = express.Router();

app.get('/gets', function (req, res) {
    console.log('get request received');
    res = res.status(200);
    if (req.get('Content-Type')) {
        console.log(req.body);
        res.type('text/plain');
    }
    res.send(getFromReqTop(req));
});

app.post('/posts', function (req, res) {
    console.log('post request');
    res = res.status(200);
    if (req.get('Content-Type')) {
        console.log(req.body);
        res = res.type(req.get('Content-Type'));
    }
    res.send(getFromReqTop(req));
});

app.put('/puts', function (req, res) {
    console.log('put request received');
    res = res.status(200);
    if (req.get('Content-Type')) {
        console.log(req.body);
        res.type('text/plain');
    }
    res.send(getFromReqTop(req));
});

app.delete('/deletes', authController.isAuthenticated, function (req, res) {
    console.log('delete request received');
    res = res.status(200);
    if (req.get('Content-Type')) {
        console.log(req.body);
        res.type('text/plain');
    }
    res.send(getFromReqTop(req));
});

app.use('*', function(req, res, next){
    res.status(405).send({message: "Unsupported method"});
    next();
})

console.log('app started' + process.env.PORT);
http.createServer(app).listen(process.env.PORT || 8080);

function getFromReqTop(req){
    if(req.headers === null){
        return getFromReqHEmpt(req);
    }

    else if(req.query == ""){
        return getFromReqQEmpt(req);
    }

    else if((req.query === null) && (req.headers === null)){
        return getFromReqHandQEmpt(req);
    }

    else {
        return getFromReq(req);
    }
}

function getFromReqHandQEmpt(req){
    var obj = {
        headers: 'empty headers',
        body: req.body,
        query: 'empty query',
        KEY: process.env.secretKey
    }
    return obj;
}

function getFromReqHEmpt(req){
    var obj = {
        headers: 'empty headers',
        body: req.body,
        query: req.query,
        KEY: process.env.secretKey
    }
    return obj;
}

function getFromReqQEmpt(req){
    var obj = {
        headers: req.headers,
        body: req.body,
        query: 'empty query',
        KEY: process.env.secretKey
    }
    return obj;
}

function getFromReq(req){
    var obj = {
        headers: req.headers,
        body: req.body,
        query: req.query,
        KEY: process.env.secretKey
    }
    return obj;
}