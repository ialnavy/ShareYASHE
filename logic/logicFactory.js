module.exports = {

    mongoClient: null,
    app: null,
    yjs: null,
    websocketProvider: null,
    codemirrorBinding: null,
    yashe: null,

    init: function (app, mongoClient, yjs, websocketProvider, codemirrorBinding, yashe) {
        this.app = app;
        this.mongoClient = mongoClient;
        this.yjs = yjs;
        this.websocketProvider = websocketProvider;
        this.codemirrorBinding = codemirrorBinding;
        this.yashe = yashe;
    },

    /* Logic */
    forAuth: async function (session) {
        let AuthLogic = (await import('./AuthLogic.mjs')).AuthLogic;
        return new AuthLogic(session);
    }, forSheets: async function () {
        let SheetsLogic = (await import('./SheetsLogic.mjs')).SheetsLogic;
        return new SheetsLogic(this.app, this.mongoClient, this.yjs, this.websocketProvider, this.codemirrorBinding, this.yashe);
    }, forUsers: async function () {
        let UsersLogic = (await import('./UsersLogic.mjs')).UsersLogic;
        return new UsersLogic(this.app, this.mongoClient);
    },

    /* Render */
    forIndexRender: async function (req, res) {
        let IndexRender = (await import('./pageRender/IndexRender.mjs')).IndexRender;
        return new IndexRender(req, res, this);
    }, forRegisterRender: async function (req, res) {
        let RegisterRender = (await import('./pageRender/RegisterRender.mjs')).RegisterRender;
        return new RegisterRender(req, res, this);
    }, forLoginRender: async function (req, res) {
        let LoginRender = (await import('./pageRender/LoginRender.mjs')).LoginRender;
        return new LoginRender(req, res, this);
    }, forSheetRender: async function (req, res) {
        let SheetRender = (await import('./pageRender/SheetRender.mjs')).SheetRender;
        return new SheetRender(req, res, this);
    }
};