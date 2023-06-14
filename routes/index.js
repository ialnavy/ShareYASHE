module.exports = function (app, appLayerFactory) {
    app.get('/', async function (req, res) {
        await (await appLayerFactory.forGetIndexCommand()).execute(req, res);
    });
}