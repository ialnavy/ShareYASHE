import {AuthBusiness} from "./pureLogic/AuthBusiness.mjs";
import {RenderBusiness} from "./pureLogic/RenderBusiness.mjs";
import {ShExDocBusiness} from "./pureLogic/ShExDocBusiness.mjs";
import {UserBusiness} from "./pureLogic/UserBusiness.mjs";

class BusinessFactory {

    /* PURE LOGIC */

    static forAuth(app, mongoClient, req, res) {
        return new AuthBusiness(app, mongoClient, req, res);
    }

    static forShExDoc(app, mongoClient, req, res) {
        return new ShExDocBusiness(app, mongoClient, req, res);
    }

    static forUser(app, mongoClient, req, res) {
        return new UserBusiness(app, mongoClient, req, res);
    }

    /* RENDER LOGIC */

    static forRenderIndex(app, mongoClient, req, res) {
        return new RenderBusiness(app, mongoClient, req, res, "", "index.pug");
    }

    static forRenderError(app, mongoClient, req, res) {
        return new RenderBusiness(app, mongoClient, req, res, " - Unexpected error", "error.pug");
    }

    static forRenderLogin(app, mongoClient, req, res) {
        return new RenderBusiness(app, mongoClient, req, res, " - Log in", "userAuth/login.pug");
    }

    static forRenderRegister(app, mongoClient, req, res) {
        return new RenderBusiness(app, mongoClient, req, res, " - Register", "userAuth/register.pug");
    }

    static forRenderCreateShExDoc(app, mongoClient, req, res) {
        return new RenderBusiness(app, mongoClient, req, res, " - Create shareable ShEx document", "shExDoc/shExDocCreate.pug");
    }

    static forRenderShExDoc(app, mongoClient, req, res) {
        return new RenderBusiness(app, mongoClient, req, res, " - Edit shareable ShEx document", "shExDoc/shExDoc.pug");
    }
}
export {BusinessFactory};