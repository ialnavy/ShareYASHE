const {ObjectId} = require("mongodb");

module.exports = function (app, logicFactory, viewEngineFactory) {

    app.get('/createDoc', async function (req, res) {
        /* Render logic */
        let authLogic = await logicFactory.forAuth(req.session);
        let renderObj = await viewEngineFactory.forShExDocCreateRender(req, res, logicFactory);

        if (!authLogic.isUserLogged()) {
            await renderObj.render('You cannot create a shareable ShEx document if you are not logged in.');
            return;
        }

        await renderObj.render();
    });

    app.post('/createDoc', async function (req, res) {
        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);
        let shexDocsLogic = await logicFactory.forShExDocs();

        /* Render logic */
        let renderObj = await viewEngineFactory.forShExDocCreateRender(req, res, logicFactory);

        if (!authLogic.isUserLogged()) {
            await renderObj.render('You cannot create a shareable ShEx document if you are not logged in.');
            return;
        }

        // Perform task
        try {
            if (typeof(req.body.title) == "undefined" || req.body.title === null || req.body.title === '') {
                await renderObj.render('Cannot create a shareable ShEx document without title');
                return;
            }
            let shExDoc = {
                'title' : (new String(req.body.title)).toString(),
                'owners' : [authLogic.getLoggedUsername()]
            };
            await shexDocsLogic.createShExDoc(shExDoc);
            res.redirect('/');
        } catch (error) {
            await renderObj.render('An error happened while the shareable ShEx document was created.');
        }
    });

    app.get('/shexDoc/:shExDocId', async function (req, res) {
        /* Render logic */
        let renderObj = await viewEngineFactory.forShExDocRender(req, res, logicFactory);

        /* Data logic */
//      let authLogic = await logicFactory.forAuth(req.session);
        let shexDocsLogic = await logicFactory.forShExDocs();

        let givenShExDocId = new ObjectId(req.params.shExDocId);
        if ((await shexDocsLogic.getShExDocById(givenShExDocId)) === null) {
            res.redirect('/');
            return;
        }

        await renderObj.render();
    });
}