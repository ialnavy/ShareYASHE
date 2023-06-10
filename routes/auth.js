module.exports = function (app, logicFactory, viewEngineFactory) {

    app.get('/register', async function (req, res) {
        /* Render logic */
        let registerRenderObj = await viewEngineFactory.forRegisterRender(req, res);

        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);

        if (authLogic.isUserLogged()) {
            res.redirect("/");
            return;
        }

        registerRenderObj.render();
    });

    app.post('/register', async function (req, res) {
        /* Render logic */
        let registerRenderObj = await viewEngineFactory.forRegisterRender(req, res);

        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);
        let usersLogic = await logicFactory.forUsers();

        if (authLogic.isUserLogged()) {
            res.redirect('/');
            return;
        }

        // Validate parameters
        if (!authLogic.isEmailValid(req.body.email)) {
            registerRenderObj.render('The email is not valid.');
            return;
        } else if (!authLogic.isUsernameValid(req.body.username)) {
            registerRenderObj.render('The username must be longer than 3 characters.');
            return;
        } else if (!authLogic.isPasswordValid(req.body.password)) {
            registerRenderObj.render('The password must be longer than 3 characters.');
            return;
        } else if ((await usersLogic.countUsersByUsername(req.body.username)) > 0) {
            registerRenderObj.render('There is already another user with the same username.');
            return;
        } else if ((await usersLogic.countUsersByEmail(req.body.email)) > 0) {
            registerRenderObj.render('There is already another user with the same email.');
            return;
        }

        // Perform task
        try {
            let user = {
                email: req.body.email,
                username: req.body.username,
                password: authLogic.cipherPassword(req.body.password, app)
            };
            usersLogic.createUser(user); // userID is returned

            res.redirect('/login');
        } catch (error) {
            registerRenderObj.render('An error happened while the user was being registered.');
        }
    });

    app.get('/login', async function (req, res) {
        /* Render logic */
        let loginRenderObj = await viewEngineFactory.forLoginRender(req, res);

        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);

        if (authLogic.isUserLogged()) {
            res.redirect('/');
            return;
        }

        loginRenderObj.render();
    });

    app.post('/login', async function (req, res) {
        /* Render logic */
        let loginRenderObj = await viewEngineFactory.forLoginRender(req, res);

        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);
        let usersLogic = await logicFactory.forUsers();

        if (authLogic.isUserLogged()) {
            res.redirect("/");
            return;
        }

        // Perform task
        try {
            if (await usersLogic.countUsersByUsername(req.body.username) === 0) {
                loginRenderObj.render('There is no such username registered.');
                return;
            }
            let user = await usersLogic.findUser({
                username: req.body.username,
                password: authLogic.cipherPassword(req.body.password, app)
            });
            if (user === null) {
                req.session.username = null;
                loginRenderObj.render('The password is incorrect.');
                return;
            }

            req.session.username = req.body.username;
            res.redirect('/');
        } catch (error) {
            req.session.username = null;
            loginRenderObj.render(error.message.toString());
        }
    });

    app.get('/logout', async function (req, res) {
        /* Render logic */
        let loginRenderObj = await viewEngineFactory.forLoginRender(req, res);

        /* Data logic */
        let authLogic = await logicFactory.forAuth(req.session);

        if (!authLogic.isUserLogged()) {
            res.redirect('/');
            return;
        }

        req.session.username = null;
        res.redirect('/');
    });
}

