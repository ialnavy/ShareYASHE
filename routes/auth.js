module.exports = async function (app, appLayerFactory) {

    let commandExecutor = await appLayerFactory.forExecutor();

    /* REGISTER (HTTP GET & HTTP POST) */
    app.get('/register', async function (req, res) {
        await commandExecutor.execute(req, res, await appLayerFactory.forGetRegisterCommand());
    });
    app.post('/register', async function (req, res) {
        await commandExecutor.execute(req, res, await appLayerFactory.forPostRegisterCommand());
    });

    /* LOGIN (HTTP GET & HTTP POST) */
    app.get('/login', async function (req, res) {
        await commandExecutor.execute(req, res, await appLayerFactory.forGetLoginCommand());
    });
    app.post('/login', async function (req, res) {
        await commandExecutor.execute(req, res, await appLayerFactory.forPostLoginCommand());
    });

    /* LOGOUT (HTTP GET) */
    app.get('/logout', async function (req, res) {
        await commandExecutor.execute(req, res, await appLayerFactory.forGetLogoutCommand());
    });
}

