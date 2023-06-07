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
    }, forSheetRender: async function (req, res) {
        let SheetRender = (await import('../presentationLayer/viewEngine/sheet/SheetRender.mjs')).SheetRender;
        return new SheetRender(req, res, this.logicFactory);
    }, forCreateSheetRender: async function (req, res) {
        let CreateSheetRender = (await import('../presentationLayer/viewEngine/sheet/CreateSheetRender.mjs')).CreateSheetRender;
        return new CreateSheetRender(req, res, this.logicFactory);
    }
};