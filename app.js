const http = require('http');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const WebSocket = require('ws');
const setupWSConnection = require('./wsServer/utils.js').setupWSConnection;

const app = express();

const {MongoClient} = require("mongodb");
app.set('connectionStrings', "mongodb://127.0.0.1:27017");

const crypto = require('crypto');
app.set('key', 'abcdefg123456');
app.set('crypto', crypto);

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const jwt = require('jsonwebtoken');
app.set('jwt', jwt);

const expressSession = require('express-session');
app.use(expressSession({secret: app.get('key'), resave: true, saveUninitialized: true}));

const favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/images/favicon.png'));

require('browser-env')();
require('clipboard');

const logicFactory = require("./applicationLayer/logicFactory.js");
logicFactory.init(app, MongoClient);

const viewEngineFactory = require("./presentationLayer/viewEngineFactory.js");
viewEngineFactory.init(app, MongoClient, logicFactory);

require('./routes/auth.js')(app, logicFactory, viewEngineFactory);
require('./routes/index.js')(app, logicFactory, viewEngineFactory);
require('./routes/sheets.js')(app, logicFactory, viewEngineFactory);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'presentationLayer/templates'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// WebSockets server

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 1234;

const server = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('okay');
});

const wss = new WebSocket.Server({noServer: true});
wss.on('connection', setupWSConnection);

server.on('upgrade', (request, socket, head) => {
    // You may check auth of request here..
    // See https://github.com/websockets/ws#client-authentication
    /**
     * @param {any} ws
     */
    const handleAuth = ws => {
        wss.emit('connection', ws, request);
    }
    wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen(port, host, () => {
    console.log(`running at '${host}' on port ${port}`);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
