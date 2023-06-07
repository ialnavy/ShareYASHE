module.exports = function (app, logicFactory) {

    app.get('/', async function (req, res) {
        /* Render logic */
        let indexRenderObj = await logicFactory.forIndexRender(req, res);

        indexRenderObj.render();
    });
}