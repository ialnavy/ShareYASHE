import {BusinessFactory} from "../../businessLayer/BusinessFactory.mjs";
import {AbstractAppLayerCommand} from "../AbstractAppLayerCommand.mjs";

class GetShExDocCommand extends AbstractAppLayerCommand {
    async execute(req, res) {
        let authBusiness = BusinessFactory.forAuth(this.app, this.mongoClient, req, res);
        let shExDocBusiness = BusinessFactory.forShExDoc(this.app, this.mongoClient, req, res);
        let indexRenderingBusiness = BusinessFactory.forRenderIndex(this.app, this.mongoClient, req, res);
        let renderingBusiness = BusinessFactory.forRenderShExDoc(this.app, this.mongoClient, req, res);

        let docId = this.asObjectId(req.params.shExDocId);
        if (!(await shExDocBusiness.existsShExDoc(docId))) {
            res.redirect('/');
            return;
        }

        if (await authBusiness.isUserLogged()) {
            await renderingBusiness.render('',
                await authBusiness.getUserLogged(),
                await shExDocBusiness.getShExDocsByOwner(await authBusiness.getUserLogged()),
                await shExDocBusiness.getShExDocById(docId));
        } else {
            await renderingBusiness.render('',
                undefined,
                undefined,
                await shExDocBusiness.getShExDocById(docId));
        }
    }
}

export {GetShExDocCommand};