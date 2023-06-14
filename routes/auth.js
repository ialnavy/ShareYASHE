module.exports = function (app, appLayerFactory) {

    /* REGISTER (HTTP GET & HTTP POST) */
    app.get('/register', async function (req, res) {
        await (await appLayerFactory.forGetRegisterCommand()).execute(req, res);
    });
    app.post('/register', async function (req, res) {
        await (await appLayerFactory.forPostRegisterCommand()).execute(req, res);
    });

    /* LOGIN (HTTP GET & HTTP POST) */
    app.get('/login', async function (req, res) {
        await (await appLayerFactory.forGetLoginCommand()).execute(req, res);
    });
    app.post('/login', async function (req, res) {
        await (await appLayerFactory.forPostLoginCommand()).execute(req, res);
    });

    /* LOGOUT (HTTP GET) */
    app.get('/logout', async function (req, res) {
        await (await appLayerFactory.forGetLogoutCommand()).execute(req, res);
    });
}

