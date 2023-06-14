import {BusinessFactory} from "../businessLayer/BusinessFactory.mjs";
import {AbstractAppLayerCommand} from "./AbstractAppLayerCommand.mjs";

class GetIndexCommand extends AbstractAppLayerCommand {
    async execute(req, res) {
        let authBusiness = BusinessFactory.forAuth(this.app, this.mongoClient, req, res);
        let shExDocBusiness = BusinessFactory.forShExDoc(this.app, this.mongoClient, req, res);
        let indexRenderingBusiness = BusinessFactory.forRenderIndex(this.app, this.mongoClient, req, res);

        if (!(await authBusiness.getUserLogged())) {
            await indexRenderingBusiness.render('');
            return;
        }

        await indexRenderingBusiness.render('',
            await authBusiness.getUserLogged(),
            await shExDocBusiness.getShExDocsByOwner(await authBusiness.getUserLogged()));
    }
}

export {GetIndexCommand};