const {ObjectId} = require("mongodb");

module.exports = function (app, logicFactory, viewEngineFactory) {

    app.get('/createSheet', async function (req, res) {
        /* Render logic */
        let createSheetRenderObj = await viewEngineFactory.forCreateSheetRender(req, res, logicFactory);
        await createSheetRenderObj.render();
    });

    app.post('/createSheet', async function (req, res) {
        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);
        let sheetsLogic = await logicFactory.forSheets();

        /* Render logic */
        let createSheetRenderObj = await viewEngineFactory.forCreateSheetRender(req, res, logicFactory);

        if (!authLogic.isUserLogged()) {
            await createSheetRenderObj.render('You cannot create a piece of sheet if you are not logged in.');
            return;
        }

        // Perform task
        try {
            if (typeof(req.body.title) == "undefined" || req.body.title === null || req.body.title === '') {
                await createSheetRenderObj.render('Cannot create a piece of sheet without title');
                return;
            }
            let safeContent = "";
            if (typeof(req.body.content) != "undefined" && req.body.content !== null)
                safeContent = (new String(req.body.content)).toString();

            let sheet = {
                'title' : (new String(req.body.title)).toString(),
                'content' : safeContent,
                'owners' : [authLogic.getLoggedUsername()]
            };
            await sheetsLogic.createSheet(sheet);
            res.redirect('/');
        } catch (error) {
            await createSheetRenderObj.render('An error happened while the piece of sheet was created.');
        }
    });

    app.get('/sheet/:sheet_id', async function (req, res) {
        /* Render logic */
        let sheetRenderObj = await viewEngineFactory.forSheetRender(req, res, logicFactory);

        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);
        let sheetsLogic = await logicFactory.forSheets();

        let givenSheetId = new ObjectId(req.params.sheet_id);
        if (await sheetsLogic.countSheetsById(givenSheetId) === 0) {
            res.redirect('/');
            return;
        }

        let sheet = await sheetsLogic.getSheetById(givenSheetId);

        await sheetRenderObj.render();
    });
}