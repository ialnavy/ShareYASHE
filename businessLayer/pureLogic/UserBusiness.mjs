import {AbstractBusiness} from "../AbstractBusiness.mjs";
import {PersistenceFactory} from "../../persistenceLayer/PersistenceFactory.mjs";

class UserBusiness extends AbstractBusiness {
    async createUser() {
        let usersRepo = PersistenceFactory.forUsers(this.app, this.mongoClient);
        let user = {
            email: this.req.body.email,
            username: this.req.body.username,
            password: this.cipherPassword(this.req.body.password)
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

}
export {UserBusiness};