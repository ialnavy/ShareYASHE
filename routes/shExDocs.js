module.exports = async function (app, appLayerFactory) {
    /* DOC CREATION (HTTP GET & HTTP POST) */
    app.get('/createDoc', async function (req, res) {
        await appLayerFactory.forGetCreateShExDocCommand(req, res);
    });
    app.post('/createDoc', async function (req, res) {
        await appLayerFactory.forPostCreateShExDocCommand(req, res);
    });

    /* DOC EDITING (HTTP GET) */
    app.get('/shexDoc/:shExDocId', async function (req, res) {
        await appLayerFactory.forGetShExDocCommand(req, res);
    });

    /* DOC OPERATIONS (HTTP GET) */
    app.get('/leaveOwnership/:shExDocId', async function (req, res) {
        await appLayerFactory.forGetLeaveOwnershipCommand(req, res);
    });
    app.post('/addOwner/:shExDocId', async function (req, res) {
        await appLayerFactory.forPostAddOwnerCommand(req, res);
    });
}
