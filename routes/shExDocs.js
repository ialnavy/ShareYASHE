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

        let givenShExDocId = null;
        try {
            givenShExDocId = new ObjectId(req.params.shExDocId);
        } catch (error) {
            res.redirect('/');
            return;
        }
        if ((await shexDocsLogic.getShExDocById(givenShExDocId)) === null) {
            res.redirect('/');
            return;
        }

        await renderObj.render();
    });

    app.get('/deleteDoc/:shExDocId', async function (req, res) {
        /* Render logic */
        let renderObj = await viewEngineFactory.forShExDocRender(req, res, logicFactory);

        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);
        let shexDocsLogic = await logicFactory.forShExDocs();

        let givenShExDocId = req.params.shExDocId.toString();
        let shExDoc = null;
        try {
            shExDoc = await shexDocsLogic.findById(givenShExDocId);
        } catch (error) {
            await renderObj.render(error.message);
            return;
        }
        if (shExDoc === null) {
            await renderObj.render("There is no ShEx doc with the given ID");
            return;
        }

        if (!authLogic.isUserLogged() || !shExDoc.owners.includes(authLogic.getLoggedUsername().toString())) {
            await renderObj.render("You cannot delete this ShEx doc because you do not own it");
            return;
        }

        await shexDocsLogic.deleteById(givenShExDocId);

        res.redirect('/');
    });

    app.post('/shareDoc/:shExDocId', async function (req, res) {
        /* Render logic */
        let renderObj = await viewEngineFactory.forShExDocRender(req, res, logicFactory);

        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);
        let shexDocsLogic = await logicFactory.forShExDocs();

        let givenShExDocId = req.params.shExDocId.toString();
        let shExDoc = null;
        try {
            shExDoc = await shexDocsLogic.findById(givenShExDocId);
        } catch (error) {
            await renderObj.render(error.message);
            return;
        }
        if (shExDoc === null) {
            await renderObj.render("There is no ShEx doc with the given ID");
            return;
        }

        if (!authLogic.isUserLogged() || !shExDoc.owners.includes(authLogic.getLoggedUsername().toString())) {
            await renderObj.render("You cannot share this ShEx doc because you do not own it");
            return;
        }

        // Perform task
        try {
            if (typeof(req.body.newOwner) == "undefined" || req.body.newOwner === null || req.body.newOwner === '') {
                await renderObj.render('Cannot share a ShEx document with an undefined user');
                return;
            }
            await shexDocsLogic.addOwner(givenShExDocId, req.body.newOwner.toString());
        } catch (error) {
            await renderObj.render(error.message);
            return;
        }

        await renderObj.render();
    });
}