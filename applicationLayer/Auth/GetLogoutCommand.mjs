import {BusinessFactory} from "../../businessLayer/BusinessFactory.mjs";
import {AbstractAppLayerCommand} from "../AbstractAppLayerCommand.mjs";

class GetLogoutCommand extends AbstractAppLayerCommand {
    async execute(req, res) {
        let authBusiness = BusinessFactory.forAuth(this.app, this.mongoClient, req, res);

        if (!(await authBusiness.isUserLogged())) {
            res.redirect("/");
            return;
        }

        await authBusiness.doLogout();
        res.redirect("/");
    }
}

export {GetLogoutCommand};