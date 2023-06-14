class AbstractBusiness {
    constructor(app, mongoClient, req, res) {
        this.req = req;
        this.res = res;
        this.app = app;
        this.mongoClient = mongoClient;
    }

    cipherPassword(password) {
        return this.app.get("crypto").createHmac('sha512', this.app.get('key')).update(password).digest('hex');
    }
}
export {AbstractBusiness};