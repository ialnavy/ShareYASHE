module.exports = function (app, logicFactory) {

    app.get('/createSheet', async function (req, res) {
        /* Render logic */
        let indexRenderObj = await logicFactory.forIndex(req, res);

        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);
        let sheetsLogic = await logicFactory.forSheets();

        if (!authLogic.isUserLogged()) {
            res.redirect("/login");
            return;
        }

        await sheetsLogic.createSheet(authLogic.getLoggedUsername());
        res.redirect('/');
    });
}