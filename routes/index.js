module.exports = function (app, logicFactory) {

    app.get('/', async function (req, res) {
        /* Render logic */
        let indexRenderObj = await logicFactory.forIndex(req, res);

        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);

        if (!authLogic.isUserLogged()) {
            res.redirect("/login");
            return;
        }

        indexRenderObj.render();
    });
}