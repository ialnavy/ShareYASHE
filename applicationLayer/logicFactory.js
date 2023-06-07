module.exports = {

    mongoClient: null,
    app: null,

    init: function (app, mongoClient) {
        this.app = app;
        this.mongoClient = mongoClient;
    },

    forAuth: async function (session) {
        let AuthLogic = (await import('./AuthLogic.mjs')).AuthLogic;
        return new AuthLogic(session);
    }, forSheets: async function () {
        let SheetsLogic = (await import('./SheetsLogic.mjs')).SheetsLogic;
        return new SheetsLogic(this.app, this.mongoClient);
    }, forUsers: async function () {
        let UsersLogic = (await import('./UsersLogic.mjs')).UsersLogic;
        return new UsersLogic(this.app, this.mongoClient);
    }
};