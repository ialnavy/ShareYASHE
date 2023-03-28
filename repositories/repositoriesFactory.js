module.exports = {
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this.mongoClient = mongoClient;
        this.app = app;
    }, forUsers: async function () {
        let AbstractRepository = (await import('./abstractRepository.mjs')).AbstractRepository;
        return new AbstractRepository(this.app, this.mongoClient, "users");
    }
};