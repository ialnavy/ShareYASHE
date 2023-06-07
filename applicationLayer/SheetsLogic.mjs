import {PersistenceFactory} from "../persistenceLayer/PersistenceFactory.mjs";

class SheetsLogic {
    constructor(app, mongoClient, yjs, websocketProvider, codemirrorBinding, yashe) {
        this.app = app;
        this.mongoClient = mongoClient;
        this.yjs = yjs;
        this.websocketProvider = websocketProvider;
        this.codemirrorBinding = codemirrorBinding;
        this.yashe = yashe;
        this.sheetsRepo = PersistenceFactory.forSheets(app, mongoClient);
        this.usersRepo = PersistenceFactory.forUsers(app, mongoClient);
    }

    async createSheet(sheet) {
        for (let iOwner in sheet.owners) {
            let iUsername = sheet.owners[iOwner];
            if ((await this.usersRepo.count({username: iUsername})) === 0)
                throw new Error('The given username: \'' .concat(iUsername).concat('\' does not exist.'));
        }
        return await this.sheetsRepo.insertOne(sheet);
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

        let sheets = [];
        if ((await this.sheetsRepo.count({owners: username})) > 0) {
            let sheetsCursor = await this.sheetsRepo.findMany({owners: username});
            while (await sheetsCursor.hasNext()) {
                let persistentSheet = await sheetsCursor.next();
                sheets.push({
                    sheetId: persistentSheet._id.toString(),
                    title: persistentSheet.title.toString()
                });
            }
        }

        return sheets;
    }
}

export {SheetsLogic};