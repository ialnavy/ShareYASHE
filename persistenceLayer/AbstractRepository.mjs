class AbstractRepository {
    static clientDB = 'local';

    constructor(app, mongoClient, collectionName) {
        this.mongoClient = mongoClient;
        this.app = app;
        this.collectionName = collectionName;
    }

    async findOne(filter, options) {
        try {
            let client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            let database = client.db(AbstractRepository.clientDB);
            let collection = database.collection(this.collectionName);
            return await collection.findOne(filter, options);
        } catch (error) {
            throw (error);
        }
    }

    async findMany(filter, projection, options) {
        try {
            let client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            let database = client.db(AbstractRepository.clientDB);
            let collection = database.collection(this.collectionName);
            return await collection.find(filter, projection, options);
        } catch (error) {
            throw (error);
        }
    }

    async findAll() {
        try {
            let client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            let database = client.db(AbstractRepository.clientDB);
            let collection = database.collection(this.collectionName);
            return await collection.find();
        } catch (error) {
            throw (error);
        }
    }

    async insertOne(item) {
        try {
            let client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            let database = client.db(AbstractRepository.clientDB);
            let collection = database.collection(this.collectionName);
            return (await collection.insertOne(item)).insertedId;
        } catch (error) {
            throw (error);
        }
    }

    async count(filter) {
        try {
            let client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            let database = client.db(AbstractRepository.clientDB);
            let collection = database.collection(this.collectionName);
            return (await collection.count(filter));
        } catch (error) {
            throw (error);
        }
    }

    async updateOne(query, update, options = {}) {
        try {
            let client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            let database = client.db(AbstractRepository.clientDB);
            let collection = database.collection(this.collectionName);
            return (await collection.updateOne(query, update, options));
        } catch (error) {
            throw (error);
        }
    }
}

export {AbstractRepository};