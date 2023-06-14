import {BusinessFactory} from "../../businessLayer/BusinessFactory.mjs";
import {AbstractAppLayerCommand} from "../AbstractAppLayerCommand.mjs";

class GetCreateShExDocCommand extends AbstractAppLayerCommand {
    async execute(req, res) {
        let authBusiness = BusinessFactory.forAuth(this.app, this.mongoClient, req, res);
        let shExDocBusiness = BusinessFactory.forShExDoc(this.app, this.mongoClient, req, res);
        let indexRenderingBusiness = BusinessFactory.forRenderIndex(this.app, this.mongoClient, req, res);
        let renderingBusiness = BusinessFactory.forRenderCreateShExDoc(this.app, this.mongoClient, req, res);

        if (!(await authBusiness.isUserLogged())) {
            await indexRenderingBusiness.render(
                'You cannot create a shareable ShEx document if you are not logged in.');
            return;
        }

        await renderingBusiness.render('',
            await authBusiness.getUserLogged(),
            await shExDocBusiness.getShExDocsByOwner(await authBusiness.getUserLogged()));
    }
}

export {GetCreateShExDocCommand};