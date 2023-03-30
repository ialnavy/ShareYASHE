module.exports = {
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this.mongoClient = mongoClient;
        this.app = app;
    }, forUsers: async function () {
        let AbstractRepository = (await import('./AbstractRepository.mjs')).AbstractRepository;
        return new AbstractRepository(this.app, this.mongoClient, "users");
    }, forSheets: async function () {
        let AbstractRepository = (await import('./AbstractRepository.mjs')).AbstractRepository;
        return new AbstractRepository(this.app, this.mongoClient, "sheets");
    }
};