import {AbstractBusiness} from "../AbstractBusiness.mjs";
import {PersistenceFactory} from "../../persistenceLayer/PersistenceFactory.mjs";

class UserBusiness extends AbstractBusiness {
    async createUser() {
        let usersRepo = PersistenceFactory.forUsers(this.app, this.mongoClient);
        let user = {
            email: this.req.body.email,
            username: this.req.body.username,
            password: this.cipherPassword(this.req.body.password),
            creationDate: new Date()
        };
        await usersRepo.insertOne(user);
    }

    async checkLoginCredentials() {
        let usersRepo = PersistenceFactory.forUsers(this.app, this.mongoClient);
        let username = (new String(this.req.body.username)).toString();

        if ((await usersRepo.count({username: username})) === 0)
            return false;

        let user = await usersRepo.findOne({username: username});
        if (user === null || user === undefined)
            return false;
        return ((new String(user.password)).toString()
            === (new String(this.cipherPassword(this.req.body.password))).toString());
    }

    async existsUser(user) {
        if (user === null || user === undefined || user === '')
            return false;
        let usersRepo = PersistenceFactory.forUsers(this.app, this.mongoClient);
        let username = (new String(user)).toString();
        return ((await usersRepo.count({username: username})) !== 0)
    }

    async unregisterUser(givenUsername) {
        if (givenUsername === null || givenUsername === undefined || givenUsername === '')
            return;
        let shExDocsRepo = PersistenceFactory.forShExDocs(this.app, this.mongoClient);
        let usersRepo = PersistenceFactory.forUsers(this.app, this.mongoClient);
        let username = (new String(givenUsername)).toString();
        if ((await usersRepo.count({username: username})) === 0)
            return;

        let modifications = [];
        let cursor = await shExDocsRepo.findMany({owners: username});
        while (await cursor.hasNext()) {
            let ownedShExDoc = await cursor.next();
            let newOwners = [];
            for (let previousOwner of ownedShExDoc.owners) {
                if (previousOwner !== username)
                    newOwners.push(previousOwner);
            }
            modifications.push([ownedShExDoc._id, newOwners]);
        }
        for (let modification of modifications)
            await shExDocsRepo.updateOne({_id: modification[0]}, {"$set": { owners: modification[1] }});

        let user = await usersRepo.findOne({username: username});
        await usersRepo.deleteOne({_id: user._id});
    }

}
export {UserBusiness};