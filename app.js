const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

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

const repositoriesFactory = require("./repositories/repositoriesFactory.js");
repositoriesFactory.init(app, MongoClient);
require('./routes/auth.js')(app, repositoriesFactory);
require('./routes/index.js')(app, repositoriesFactory);
require('./routes/users.js')(app, repositoriesFactory);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
