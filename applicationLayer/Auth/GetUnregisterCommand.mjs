import {BusinessFactory} from "../../businessLayer/BusinessFactory.mjs";
import {AbstractAppLayerCommand} from "../AbstractAppLayerCommand.mjs";

class GetUnregisterCommand extends AbstractAppLayerCommand {
    async execute(req, res) {
        let authBusiness = BusinessFactory.forAuth(this.app, this.mongoClient, req, res);
        let shExDocBusiness = BusinessFactory.forShExDoc(this.app, this.mongoClient, req, res);
        let renderingBusiness = BusinessFactory.forRenderUnregister(this.app, this.mongoClient, req, res);

        if (!(await authBusiness.isUserLogged())) {
            res.redirect("/");
            return;
        }

        await renderingBusiness.render('', 
                await authBusiness.getUserLogged(),
                await shExDocBusiness.getShExDocsByOwner(await authBusiness.getUserLogged()),);
    }
}

export {GetUnregisterCommand};