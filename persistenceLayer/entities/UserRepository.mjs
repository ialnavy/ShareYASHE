import {AbstractRepository} from "../AbstractRepository.mjs";

class UserRepository extends AbstractRepository {
    constructor(app, mongoClient) {
        super(app, mongoClient, "users");
    }
}

export {UserRepository};
