module.exports = {

    mongoClient: null,
    app: null,

    init: function (app, mongoClient, logicFactory) {
        this.app = app;
        this.mongoClient = mongoClient;
        this.logicFactory = logicFactory;
    },

    forIndexRender: async function (req, res) {
        let IndexRender = (await import('../presentationLayer/viewEngine/IndexRender.mjs')).IndexRender;
        return new IndexRender(req, res, this.logicFactory);
    }, forRegisterRender: async function (req, res) {
        let RegisterRender = (await import('../presentationLayer/viewEngine/userAuth/RegisterRender.mjs')).RegisterRender;
        return new RegisterRender(req, res, this.logicFactory);
    }, forLoginRender: async function (req, res) {
        let LoginRender = (await import('../presentationLayer/viewEngine/userAuth/LoginRender.mjs')).LoginRender;
        return new LoginRender(req, res, this.logicFactory);
    }, forShExDocRender: async function (req, res) {
        let ShExDocRender = (await import('./viewEngine/shExDoc/ShExDocRender.mjs')).ShExDocRender;
        return new ShExDocRender(req, res, this.logicFactory);
    }, forShExDocCreateRender: async function (req, res) {
        let ShExDocCreateRender = (await import('../presentationLayer/viewEngine/shExDoc/ShExDocCreateRender.mjs')).ShExDocCreateRender;
        return new ShExDocCreateRender(req, res, this.logicFactory);
    }
};