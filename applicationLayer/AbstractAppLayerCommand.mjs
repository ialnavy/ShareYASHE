class AbstractAppLayerCommand {
    constructor(app, mongoClient, ObjectId) {
        this.app = app;
        this.mongoClient = mongoClient;
        this.ObjectId = ObjectId;
    }

    async execute(req, res) {
        throw new Error("To override");
    }

    asObjectId(stringID) {
        let stringIdAsObjectId = null;
        try {
            stringIdAsObjectId = new this.ObjectId(stringID);
        } catch (error) {
            return null;
        }
        return stringIdAsObjectId;
    }
}
export {AbstractAppLayerCommand};