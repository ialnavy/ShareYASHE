module.exports = async function (app, appLayerFactory) {

    /* REGISTER (HTTP GET & HTTP POST) */
    app.get('/register', async function (req, res) {
        await appLayerFactory.forGetRegisterCommand(req, res);
    });
    app.post('/register', async function (req, res) {
        await appLayerFactory.forPostRegisterCommand(req, res);
    });

    /* UNREGISTER (HTTP GET & HTTP POST) */
    app.get('/unregister', async function (req, res) {
        await appLayerFactory.forGetUnregisterCommand(req, res);
    });
    app.post('/unregister', async function (req, res) {
        await appLayerFactory.forPostUnregisterCommand(req, res);
    });

    /* LOGIN (HTTP GET & HTTP POST) */
    app.get('/login', async function (req, res) {
        await appLayerFactory.forGetLoginCommand(req, res);
    });
    app.post('/login', async function (req, res) {
        await appLayerFactory.forPostLoginCommand(req, res);
    });

    /* LOGOUT (HTTP GET) */
    app.get('/logout', async function (req, res) {
        await appLayerFactory.forGetLogoutCommand(req, res);
    });
}

