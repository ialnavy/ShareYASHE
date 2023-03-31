const {ObjectId} = require("mongodb");

module.exports = function (app, logicFactory) {

    app.get('/createSheet', async function (req, res) {
        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);
        let sheetsLogic = await logicFactory.forSheets();

        if (!authLogic.isUserLogged()) {
            res.redirect('/login');
            return;
        }

        await sheetsLogic.createSheet(authLogic.getLoggedUsername());
        res.redirect('/');
    });

    app.get('/sheet/:sheet_id', async function (req, res) {
        /* Render logic */
        let sheetRenderObj = await logicFactory.forSheetRender(req, res, logicFactory);

        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);
        let sheetsLogic = await logicFactory.forSheets();

        if (!authLogic.isUserLogged()) {
            res.redirect('/login');
            return;
        }

        let givenSheetId = new ObjectId(req.params.sheet_id);
        if (await sheetsLogic.countSheetsById(givenSheetId) === 0) {
            res.redirect('/');
            return;
        }

        let sheet = await sheetsLogic.getSheetById(givenSheetId);

        sheetRenderObj.render();
    });
}