import {AbstractRepository} from "../repositories/AbstractRepository.mjs";

class SheetsLogic {
    constructor(app, mongoClient) {
        this.sheetsRepo = AbstractRepository.forSheets(app, mongoClient);
        this.usersRepo = AbstractRepository.forUsers(app, mongoClient);
    }

    async createSheet(username) {
        if ((await this.usersRepo.count({username: username})) === 0)
            throw new Error('The given username does not exist.');

        let i = this.sheetsRepo.count({owners: username});

        return await this.sheetsRepo.insertOne({
            title: (new String('Untitled sheet ')).concat((new String((new Number(i)) + 1)).toString()),
            content: '',
            owners: [username]
        });
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