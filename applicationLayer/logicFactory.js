const {ObjectId} = require("mongodb");

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
    }, forShExDocs: async function () {
        let ShExDocsLogic = (await import('./ShExDocsLogic.mjs')).ShExDocsLogic;
        return new ShExDocsLogic(this.app, this.mongoClient, ObjectId);
    }, forUsers: async function () {
        let UsersLogic = (await import('./UsersLogic.mjs')).UsersLogic;
        return new UsersLogic(this.app, this.mongoClient);
    }
};