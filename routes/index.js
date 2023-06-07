module.exports = function (app, logicFactory, viewEngineFactory) {

    app.get('/', async function (req, res) {
        /* Render logic */
        let indexRenderObj = await viewEngineFactory.forIndexRender(req, res);

        indexRenderObj.render();
    });
}