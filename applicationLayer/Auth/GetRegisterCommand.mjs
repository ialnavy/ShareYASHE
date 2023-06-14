import {BusinessFactory} from "../../businessLayer/BusinessFactory.mjs";
import {AbstractAppLayerCommand} from "../AbstractAppLayerCommand.mjs";

class GetRegisterCommand extends AbstractAppLayerCommand {
    async execute(req, res) {
        let authBusiness = BusinessFactory.forAuth(this.app, this.mongoClient, req, res);
        let renderingBusiness = BusinessFactory.forRenderRegister(this.app, this.mongoClient, req, res);

        if (await authBusiness.isUserLogged()) {
            res.redirect("/");
            return;
        }

        await renderingBusiness.render('');
    }
}

export {GetRegisterCommand};