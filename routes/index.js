module.exports = async function (app, appLayerFactory) {

    let commandExecutor = await appLayerFactory.forExecutor();

    app.get('/', async function (req, res) {
        await commandExecutor.execute(req, res, await appLayerFactory.forGetIndexCommand());
    });
}