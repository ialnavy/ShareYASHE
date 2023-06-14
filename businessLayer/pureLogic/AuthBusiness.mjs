import {AbstractBusiness} from "../AbstractBusiness.mjs";
import {PersistenceFactory} from "../../persistenceLayer/PersistenceFactory.mjs";

class AuthBusiness extends AbstractBusiness {

    /* LOGIN */
    async isUserLogged() {
        let supposedToBeTheUsername = null;
        try {
            supposedToBeTheUsername = this.req.session.username;
        } catch (error) {
            return false;
        }
        return !(supposedToBeTheUsername === null
            || typeof (supposedToBeTheUsername) === 'undefined'
            || supposedToBeTheUsername === ''
            || supposedToBeTheUsername.length === 0);
    }

    async getUserLogged() {
        let supposedToBeTheUsername = null;
        try {
            supposedToBeTheUsername = this.req.session.username;
        } catch (error) {
            return false;
        }
        if (supposedToBeTheUsername === null
            || typeof (supposedToBeTheUsername) === 'undefined'
            || supposedToBeTheUsername === ''
            || supposedToBeTheUsername.length === 0)
            return null;
        return (new String(supposedToBeTheUsername)).toString();
    }

    async doLogin() {
        this.req.session.username = (new String(this.req.body.username)).toString();
    }

    async doLogout() {
        this.req.session.username = null;
    }

    /* REGISTER */

    async isValidEmail() {
        let email = this.req.body.email;
        let emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

        if (!email)
            return false;

        if (email.length > 254)
            return false;

        let valid = emailRegex.test(email);
        if (!valid)
            return false;

        // Further checking of some things regex can't handle
        let parts = email.split("@");
        if (parts[0].length > 64)
            return false;

        let domainParts = parts[1].split(".");
        if (domainParts.some(function (part) {
            return part.length > 63;
        }))
            return false;

        let usersRepo = PersistenceFactory.forUsers(this.app, this.mongoClient);
        return ((await usersRepo.count({email: email})) === 0);
    }

    async isValidUsername() {
        let username = this.req.body.username;
        if ((new String(username)).toString().toLowerCase() === "anonymous")
            return false;
        if (username === null || typeof (username) === 'undefined'
            || username === '' || username.length < 3)
            return false;

        let usersRepo = PersistenceFactory.forUsers(this.app, this.mongoClient);
        return ((await usersRepo.count({username: username})) === 0);
    }

    async isValidPassword() {
        let password = this.req.body.password;
        return (!(password === null || typeof (password) === 'undefined'
            || password === '' || password.length < 3));
    }

}
export {AuthBusiness};