import {BusinessFactory} from "../../businessLayer/BusinessFactory.mjs";
import {AbstractAppLayerCommand} from "../AbstractAppLayerCommand.mjs";

class GetLoginCommand extends AbstractAppLayerCommand {
    async execute(req, res) {
        let authBusiness = BusinessFactory.forAuth(this.app, this.mongoClient, req, res);
        let renderingBusiness = BusinessFactory.forRenderLogin(this.app, this.mongoClient, req, res);

        if (await authBusiness.isUserLogged()) {
            res.redirect("/");
            return;
        }

        await renderingBusiness.render('');
    }
}

export {GetLoginCommand};