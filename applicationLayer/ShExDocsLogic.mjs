import {PersistenceFactory} from "../persistenceLayer/PersistenceFactory.mjs";

class ShExDocsLogic {
    constructor(app, mongoClient, ObjectId) {
        this.app = app;
        this.ObjectId = ObjectId;
        this.shExDocsRepo = PersistenceFactory.forShExDocs(app, mongoClient);
        this.usersRepo = PersistenceFactory.forUsers(app, mongoClient);
    }

    async createShExDoc(shExDoc) {
        for (let iOwner in shExDoc.owners) {
            let iUsername = shExDoc.owners[iOwner];
            if ((await this.usersRepo.count({username: iUsername})) === 0)
                throw new Error('The given username: \'' .concat(iUsername).concat('\' does not exist.'));
        }
        return await this.shExDocsRepo.insertOne(shExDoc);
    }

    async getShExDocById(shExDocId) {
        if (shExDocId === null || typeof (shExDocId) === 'undefined')
            throw new Error('An invalid id was given.');
        if ((await this.shExDocsRepo.count({_id: shExDocId})) === 0)
            return null;

        return await this.shExDocsRepo.findOne({_id: shExDocId});
    }

    async getShExDocsByOwner(owner) {
        if (owner === null || typeof (owner) === 'undefined'
            || owner === '' || owner.length === 0)
            throw new Error('An invalid username was given.');

        let shExDocs = [];
        if ((await this.shExDocsRepo.count({owners: owner})) > 0) {
            let shExDocsCursor = await this.shExDocsRepo.findMany({owners: owner});
            while (await shExDocsCursor.hasNext()) {
                let persistentShExDoc = await shExDocsCursor.next();
                shExDocs.push({
                    docId: persistentShExDoc._id.toString(),
                    title: persistentShExDoc.title.toString()
                });
            }
        }

        return shExDocs;
    }

    async findById(shExDocId) {
        if (shExDocId === null || typeof (shExDocId) === 'undefined'
            || shExDocId === '' || shExDocId.length === 0)
            throw new Error('An invalid ShEx doc ID was given.');

        let objShExDocId = new this.ObjectId(shExDocId);

        if ((await this.shExDocsRepo.count({_id: objShExDocId})) === 0)
            return null;
        return await this.shExDocsRepo.findOne({_id: objShExDocId});
    }

}

export {ShExDocsLogic};