import {BusinessFactory} from "../../businessLayer/BusinessFactory.mjs";
import {AbstractAppLayerCommand} from "../AbstractAppLayerCommand.mjs";

class PostCreateShExDocCommand extends AbstractAppLayerCommand {
    async execute(req, res) {
        let authBusiness = BusinessFactory.forAuth(this.app, this.mongoClient, req, res);
        let shExDocBusiness = BusinessFactory.forShExDoc(this.app, this.mongoClient, req, res);
        let indexRenderingBusiness = BusinessFactory.forRenderIndex(this.app, this.mongoClient, req, res);

        if (!(await authBusiness.isUserLogged())) {
            await indexRenderingBusiness.render(
                'You cannot create a shareable ShEx document if you are not logged in.');
            return;
        }

        try {
            if (!(await shExDocBusiness.isCreableShExDoc())) {
                await indexRenderingBusiness.render(
                    'You cannot create a shareable ShEx document without title');
                return;
            }
            await shExDocBusiness.createShExDocForOneOwner(await authBusiness.getUserLogged());
            res.redirect('/');
        } catch (error) {
            await indexRenderingBusiness.render(
                'An error happened while the shareable ShEx document was created.');
        }
    }
}

export {PostCreateShExDocCommand};