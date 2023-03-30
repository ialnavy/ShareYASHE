import {AbstractRepository} from "../repositories/AbstractRepository.mjs";

class SheetsLogic {
    constructor(app, mongoClient, yjs, websocketProvider, codemirrorBinding, yashe) {
        this.app = app;
        this.mongoClient = mongoClient;
        this.yjs = yjs;
        this.websocketProvider = websocketProvider;
        this.codemirrorBinding = codemirrorBinding;
        this.yashe = yashe;
    }

    get sheetsRepo() {
        return AbstractRepository.forSheets(this.app, this.mongoClient);
    }

    get usersRepo() {
        return AbstractRepository.forUsers(this.app, this.mongoClient);
    }

    async createSheet(username) {
        if ((await this.usersRepo.count({username: username})) === 0)
            throw new Error('The given username does not exist.');

        let i = this.sheetsRepo.count({owners: username});

        return await this.sheetsRepo.insertOne({
            title: 'Untitled sheet',
            content: '',
            owners: [username]
        });
    }

    async countSheetsById(sheetId) {
        if (sheetId === null || typeof (sheetId) === 'undefined')
            throw new Error('An invalid id was given.');

        return await this.sheetsRepo.count({_id: sheetId});
    }

    async getSheetById(sheetId) {
        if (sheetId === null || typeof (sheetId) === 'undefined')
            throw new Error('An invalid id was given.');

        return await this.sheetsRepo.findOne({_id: sheetId});
    }

    async countSheetsByUsername(username) {
        if (username === null || typeof (username) === 'undefined'
            || username === '' || username.length === 0)
            throw new Error('An invalid username was given.');

        return await this.sheetsRepo.count({owners: username});
    }

    async getSheetsByUsername(username) {
        if (username === null || typeof (username) === 'undefined'
            || username === '' || username.length === 0)
            throw new Error('An invalid username was given.');

        return await this.sheetsRepo.findMany({owners: username});
    }
}

export {SheetsLogic};