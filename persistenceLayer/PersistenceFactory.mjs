import {UserRepository} from "./entities/UserRepository.mjs";
import {ShExDocRepository} from "./entities/ShExDocRepository.mjs";

class PersistenceFactory {

    static forUsers(app, mongoClient) {
        return new UserRepository(app, mongoClient);
    }

    static forShExDocs(app, mongoClient) {
        return new ShExDocRepository(app, mongoClient);
    }

}

export {PersistenceFactory};