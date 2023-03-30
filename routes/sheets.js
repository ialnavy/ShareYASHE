module.exports = function (app, logicFactory) {

    app.get('/createSheet', async function (req, res) {
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

    app.get('/sheet/:sheet_id', async function (req, res) {
        /* Render logic */
        let sheetRenderObj = await logicFactory.forSheetRender(req, res);

        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);
        let sheetsLogic = await logicFactory.forSheets();

        if (!authLogic.isUserLogged()) {
            res.redirect("/login");
            return;
        }

        let givenSheetId = req.params.sheet_id;

    });
}