import {AbstractRepository} from "../AbstractRepository.mjs";

class SheetRepository extends AbstractRepository {
    constructor(app, mongoClient) {
        super(app, mongoClient, "sheet");
    }
}

export {SheetRepository};
