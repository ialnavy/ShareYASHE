module.exports = function (app, repositoriesFactory) {

    app.get('/', async function (req, res, next) {
        if (req.session.username === null
            || typeof(req.session.username) === "undefined"
            || req.session.username === '') {
            res.redirect('/login');
            return;
        }
        res.render('index.pug', {title: 'ShareYASHE', username: new String(req.session.username)});
    });
}