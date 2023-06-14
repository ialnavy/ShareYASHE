import {BusinessFactory} from "../../businessLayer/BusinessFactory.mjs";
import {AbstractAppLayerCommand} from "../AbstractAppLayerCommand.mjs";

class PostRegisterCommand extends AbstractAppLayerCommand {
    async execute(req, res) {
        let authBusiness = BusinessFactory.forAuth(this.app, this.mongoClient, req, res);
        let userBusiness = BusinessFactory.forUser(this.app, this.mongoClient, req, res);
        let renderingBusiness = BusinessFactory.forRenderRegister(this.app, this.mongoClient, req, res);

        if (await authBusiness.isUserLogged()) {
            res.redirect("/");
            return;
        }

        if (!(await authBusiness.isValidEmail())) {
            await renderingBusiness.render("The given email is not valid, or is already taken.");
            return;
        } if (!(await authBusiness.isValidUsername())) {
            await renderingBusiness.render("The username is not valid, or is already taken.");
            return;
        } if (!(await authBusiness.isValidPassword())) {
            await renderingBusiness.render("The password must be longer than 3 characters.");
            return;
        }

        await userBusiness.createUser();
        res.redirect('/login');
    }
}

export {PostRegisterCommand};