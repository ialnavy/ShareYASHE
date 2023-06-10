import {AbstractRepository} from "../AbstractRepository.mjs";

class ShExDocRepository extends AbstractRepository {
    constructor(app, mongoClient) {
        super(app, mongoClient, "shExDocs");
    }
}

export {ShExDocRepository};
