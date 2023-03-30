import {AbstractRepository} from "../repositories/AbstractRepository.mjs";

class UsersLogic {
    constructor(app, mongoClient) {
        this.repo = AbstractRepository.forUsers(app, mongoClient);
    }

    async createUser(user) {
        return await this.repo.insertOne(user);
    }

    async findUser(filter) {
        return await this.repo.findOne(filter);
    }

    async countUsersByUsername(username) {
        if (username === null || typeof (username) === 'undefined'
            || username === '' || username.length === 0)
            throw new Error('An invalid username was given.');

        return await this.repo.count({username: username});
    }

    async countUsersByEmail(email) {
        if (email === null || typeof (email) === 'undefined'
            || email === '' || email.length === 0)
            throw new Error('An invalid username was given.');

        return await this.repo.count({email: email});
    }
}

export {UsersLogic};