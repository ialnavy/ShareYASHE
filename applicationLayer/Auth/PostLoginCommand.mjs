import {BusinessFactory} from "../../businessLayer/BusinessFactory.mjs";
import {AbstractAppLayerCommand} from "../AbstractAppLayerCommand.mjs";

class PostLoginCommand extends AbstractAppLayerCommand {
    async execute(req, res) {
        let authBusiness = BusinessFactory.forAuth(this.app, this.mongoClient, req, res);
        let userBusiness = BusinessFactory.forUser(this.app, this.mongoClient, req, res);
        let renderingBusiness = BusinessFactory.forRenderLogin(this.app, this.mongoClient, req, res);

        if (await authBusiness.isUserLogged()) {
            res.redirect("/");
            return;
        }

        if (!(await userBusiness.checkLoginCredentials())) {
            await renderingBusiness.render("The credentials are not valid.");
            return;
        }

        await authBusiness.doLogin();
        res.redirect('/');
    }
}

export {PostLoginCommand};