import {AbstractBusiness} from "../AbstractBusiness.mjs";
import {PersistenceFactory} from "../../persistenceLayer/PersistenceFactory.mjs";
import {ObjectId} from "mongodb";

class ShExDocBusiness extends AbstractBusiness {
    async getShExDocsByOwner(owner) {
        let shExDocsRepo = PersistenceFactory.forShExDocs(this.app, this.mongoClient);

        let shExDocs = [];
        if (owner === null || typeof (owner) === 'undefined'
            || owner === '' || owner.length === 0)
            return [];

        if ((await shExDocsRepo.count({owners: owner})) > 0) {
            let shExDocsCursor = await shExDocsRepo.findMany({owners: owner});
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

    async isCreableShExDoc() {
        return !(typeof(this.req.body.title) == "undefined"
            || this.req.body.title === null
            || this.req.body.title === '');
    }

    async createShExDocForOneOwner(username) {
        let usersRepo = PersistenceFactory.forUsers(this.app, this.mongoClient);
        let shExDocsRepo = PersistenceFactory.forShExDocs(this.app, this.mongoClient);

        let shExDoc = {
            'title' : (new String(this.req.body.title)).toString(),
            'owners' : [username]
        };
        if ((await usersRepo.count({username: username})) !== 0)
            await shExDocsRepo.insertOne(shExDoc);
    }

    async existsShExDoc(shExDocId) {
        let shExDocsRepo = PersistenceFactory.forShExDocs(this.app, this.mongoClient);
        if (shExDocId === null || shExDocId === undefined)
            return false;
        return (await shExDocsRepo.count({_id: shExDocId})) !== 0;
    }

    async getShExDocById(shExDocId) {
        let shExDocsRepo = PersistenceFactory.forShExDocs(this.app, this.mongoClient);
        if (shExDocId === null || shExDocId === undefined)
            return false;
        if ((await shExDocsRepo.count({_id: shExDocId})) === 0)
            return null;
        return await shExDocsRepo.findOne({_id: shExDocId});
    }
}
export {ShExDocBusiness};