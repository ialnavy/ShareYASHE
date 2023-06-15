module.exports = async function (app, appLayerFactory) {

    let commandExecutor = await appLayerFactory.forExecutor();

    /* DOC CREATION (HTTP GET & HTTP POST) */
    app.get('/createDoc', async function (req, res) {
        await commandExecutor.execute(req, res, await appLayerFactory.forGetCreateShExDocCommand());
    });
    app.post('/createDoc', async function (req, res) {
        await commandExecutor.execute(req, res, await appLayerFactory.forPostCreateShExDocCommand());
    });

    /* DOC EDITING (HTTP GET) */
    app.get('/shexDoc/:shExDocId', async function (req, res) {
        await commandExecutor.execute(req, res, await appLayerFactory.forGetShExDocCommand());
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