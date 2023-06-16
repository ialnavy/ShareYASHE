import {BusinessFactory} from "../../businessLayer/BusinessFactory.mjs";
import {AbstractAppLayerCommand} from "../AbstractAppLayerCommand.mjs";

class PostUnregisterCommand extends AbstractAppLayerCommand {
    async execute(req, res) {
        let authBusiness = BusinessFactory.forAuth(this.app, this.mongoClient, req, res);
        let userBusiness = BusinessFactory.forUser(this.app, this.mongoClient, req, res);

        if (!(await authBusiness.isUserLogged())) {
            res.redirect("/");
            return;
        }

        let username = await authBusiness.getUserLogged();
        await authBusiness.doLogout();
        await userBusiness.unregisterUser(username);

        res.redirect('/');
    }
}

export {PostUnregisterCommand};