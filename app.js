const http = require('http');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {MongoClient} = require("mongodb");
const {MongodbPersistence} = require("y-mongodb-provider");
const WebSocket = require('ws');
const {setPersistence, setupWSConnection} = require("./wsServer/utils");
const Y = require("yjs");

const app = express();

app.set('connectionStrings', process.env.SHAREYASHE_MONGODB);

const crypto = require('crypto');
app.set('key', process.env.SHAREYASHE_CRYPTO_KEY);
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

const appLayerFactory = require("./applicationLayer/appLayerFactory.js");
appLayerFactory.init(app, MongoClient);

require('./routes/auth.js')(app, appLayerFactory);
require('./routes/index.js')(app, appLayerFactory);
require('./routes/shExDocs.js')(app, appLayerFactory);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'presentationLayer'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// WebSockets server

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 2403;

const server = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('okay');
});

const mdb = new MongodbPersistence(app.get("connectionStrings"), {
    collectionName: "transactions",
    flushSize: 100,
    multipleCollections: true
});

setPersistence({
    bindState: async (docName, ydoc) => {
        // Here you listen to granular document updates and store them in the database
        // You don't have to do this, but it ensures that you don't lose content when the server crashes
        // See https://github.com/yjs/yjs#Document-Updates for documentation on how to encode
        // document updates

        // official default code from: https://github.com/yjs/y-websocket/blob/37887badc1f00326855a29fc6b9197745866c3aa/bin/utils.js#L36
        const persistedYdoc = await mdb.getYDoc(docName);
        const newUpdates = Y.encodeStateAsUpdate(ydoc);
        await mdb.storeUpdate(docName, newUpdates);
        Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
        ydoc.on('update', async update => {
            await mdb.storeUpdate(docName, update);
        })
    },
    writeState: async (docName, ydoc) => {
        // This is called when all connections to the document are closed.
        // In the future, this method might also be called in intervals or after a certain number of updates.
        return new Promise(resolve => {
            // When the returned Promise resolves, the document will be destroyed.
            // So make sure that the document really has been written to the database.
            resolve();
        })
    }
})
const wss = new WebSocket.Server({port: port});
wss.on('connection', async (conn, req, options) => {
    // Invoke the original setupWSConnection
    let yDoc = setupWSConnection(conn, req, options);
//  yDoc.on('update', (update) => {
//      console.log(yDoc.getText().toString().concat("\n\n"));
//  });

    // Send the Y.Doc instance to the client
    conn.send(JSON.stringify({ type: 'yDoc', yDoc: yDoc.toJSON() }));

    console.log("Connection set");
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

server.listen(port, host, () => {
    console.log("Running WebSocket Server on port ".concat(port));
});

/*
app.listen(80, () => {
    console.log("Running HTTP Server on port 80");
});
*/

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
