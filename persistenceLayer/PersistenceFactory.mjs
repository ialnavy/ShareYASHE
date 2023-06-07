import {UserRepository} from "./entities/UserRepository.mjs";
import {SheetRepository} from "./entities/SheetRepository.mjs";

class PersistenceFactory {

    static forUsers(app, mongoClient) {
        return new UserRepository(app, mongoClient);
    }

    static forSheets(app, mongoClient) {
        return new SheetRepository(app, mongoClient);
    }

}

export {PersistenceFactory};