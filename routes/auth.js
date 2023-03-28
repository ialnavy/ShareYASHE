module.exports = function (app, repositoriesFactory) {

    app.get('/register', function (req, res) {
        res.render("register.pug", {title: 'ShareYASHE - Register'});
    });

    app.post('/register', async function (req, res) {
        let securePassword = app.get("crypto")
            .createHmac('sha512', app.get('key'))
            .update(req.body.password).digest('hex');
        let user = {email: req.body.email, username: req.body.username, password: securePassword};
        let usersRepository = await repositoriesFactory.forUsers();

        // Validate parameters
        if (!isEmailValid(req.body.email)) {
            res.render("register.pug", {title: 'ShareYASHE - Register', message: 'The email is not valid.'});
            return;
        }

        if ((await usersRepository.count({email: req.body.email}, null)) > 0) {
            res.render("register.pug", {
                title: 'ShareYASHE - Register',
                message: 'There is already another user with the same email.'
            });
            return;
        }

        if (typeof (req.body.username) === "undefined"
            || req.body.username === null
            || req.body.username.length < 3) {
            res.render("register.pug", {
                title: 'ShareYASHE - Register',
                message: 'The username must be longer than 3 characters.'
            });
            return;
        }

        if ((await usersRepository.count({username: req.body.username}, null)) > 0) {
            res.render("register.pug", {
                title: 'ShareYASHE - Register',
                message: 'There is already another user with the same username.'
            });
            return;
        }

        if (typeof (req.body.password) === "undefined"
            || req.body.password === null
            || req.body.password.length < 3) {
            res.render("register.pug", {
                title: 'ShareYASHE - Register',
                message: 'The password must be longer than 3 characters.'
            });
            return;
        }

        // Perform task
        try {
            // DO NOT REMOVE 'await'
            let userId = await usersRepository.insertOne(user);

            res.render("login.pug", {title: 'ShareYASHE - Log in', message: 'User registered successfully.'});
        } catch (error) {
            res.render("register.pug", {
                title: 'ShareYASHE - Register',
                message: 'An error happened while the user was being registered.'
            });
        }
    });

    app.get('/login', function (req, res) {
        res.render("login.pug", {title: 'ShareYASHE - Log in'});
    });

    app.post('/login', async function (req, res) {
        let securePassword = app.get("crypto")
            .createHmac('sha512', app.get('key'))
            .update(req.body.password).digest('hex');
        let filter = {username: req.body.username, password: securePassword};
        let options = {};
        let usersRepository = await repositoriesFactory.forUsers();

        // Perform task
        try {
            // DO NOT REMOVE 'await'
            let user = await usersRepository.findOne(filter, {});
            if (user === null) {
                req.session.username = null;
                res.render("login.pug", {title: 'ShareYASHE - Log in', message: 'The credentials don\'t match.'});
                return;
            }
            req.session.username = user.username;
            res.redirect("/");
        } catch (error) {
            req.session.username = null;
            res.render("login.pug", {
                title: 'ShareYASHE - Log in',
                message: 'An error happened while the user was being logged in.'
            });
        }
    });

    app.get('/logout', function (req, res) {
        if (req.session.username === null
            || typeof (req.session.username) === "undefined"
            || req.session.username === '') {
            res.render("login.pug", {title: 'ShareYASHE - Log in'});
            return;
        }

        req.session.username = null;
        res.render("login.pug", {
            title: 'ShareYASHE - Log in',
            message: 'The user has been logged out successfully.'
        });

    });
}

function isEmailValid(email) {
    let emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!email)
        return false;

    if (email.length > 254)
        return false;

    let valid = emailRegex.test(email);
    if (!valid)
        return false;

    // Further checking of some things regex can't handle
    let parts = email.split("@");
    if (parts[0].length > 64)
        return false;

    let domainParts = parts[1].split(".");
    if (domainParts.some(function (part) {
        return part.length > 63;
    }))
        return false;

    return true;
}