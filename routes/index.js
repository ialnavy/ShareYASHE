module.exports = async function (app, appLayerFactory) {
    app.get('/', async function (req, res) {
        await appLayerFactory.forGetIndexCommand(req, res);
    });
}