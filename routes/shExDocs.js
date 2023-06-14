module.exports = function (app, appLayerFactory) {

    /* DOC CREATION (HTTP GET & HTTP POST) */
    app.get('/createDoc', async function (req, res) {
        await (await appLayerFactory.forGetCreateShExDocCommand()).execute(req, res);
    });
    app.post('/createDoc', async function (req, res) {
        await (await appLayerFactory.forPostCreateShExDocCommand()).execute(req, res);
    });

    /* DOC EDITING (HTTP GET) */
    app.get('/shexDoc/:shExDocId', async function (req, res) {
        await (await appLayerFactory.forGetShExDocCommand()).execute(req, res);
    });

    /* DOC OPERATIONS (HTTP GET) */
    app.get('/deleteDoc/:shExDocId', async function (req, res) {
        // TODO
    });

    app.get('/addOwner/:shExDocId', async function (req, res) {
        // TODO
    });

    app.get('/leaveOwnership/:shExDocId', async function (req, res) {
        // TODO
    });
}