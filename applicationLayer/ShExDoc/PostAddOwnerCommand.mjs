import {BusinessFactory} from "../../businessLayer/BusinessFactory.mjs";
import {AbstractAppLayerCommand} from "../AbstractAppLayerCommand.mjs";

class PostAddOwnerCommand extends AbstractAppLayerCommand {
    async execute(req, res) {
        let authBusiness = BusinessFactory.forAuth(this.app, this.mongoClient, req, res);
        let userBusiness = BusinessFactory.forUser(this.app, this.mongoClient, req, res);
        let shExDocBusiness = BusinessFactory.forShExDoc(this.app, this.mongoClient, req, res);
        let indexRenderingBusiness = BusinessFactory.forRenderIndex(this.app, this.mongoClient, req, res);
        let renderingBusiness = BusinessFactory.forRenderShExDoc(this.app, this.mongoClient, req, res);

        let docId = null;
        try {
            docId = this.asObjectId(req.params.shExDocId);
        } catch (error) {
            await indexRenderingBusiness.render(
                'There is not any ShEx doc with the given ID.');
            return;
        }

        if (!(await shExDocBusiness.existsShExDoc(docId))) {
            await indexRenderingBusiness.render(
                'There is not any ShEx doc with the given ID.');
            return;
        }

        if (!(await authBusiness.isUserLogged())) {
            await indexRenderingBusiness.render(
                'You cannot leave the ownership of a shareable ShEx document if you are not logged in.');
            return;
        }

        if (!(await shExDocBusiness.isOwnedBy(docId, await authBusiness.getUserLogged()))) {
            await renderingBusiness.render('You cannot add an owner to a shareable ShEx document that you do not own.',
                await authBusiness.getUserLogged(),
                await shExDocBusiness.getShExDocsByOwner(await authBusiness.getUserLogged()),
                await shExDocBusiness.getShExDocById(docId));
            return;
        }

        if (!(await userBusiness.existsUser(req.body.newOwner))) {
            await renderingBusiness.render('There is not any user with the given username.',
                await authBusiness.getUserLogged(),
                await shExDocBusiness.getShExDocsByOwner(await authBusiness.getUserLogged()),
                await shExDocBusiness.getShExDocById(docId));
            return;
        }

        if (await shExDocBusiness.isOwnedBy(docId, req.body.newOwner)) {
            await renderingBusiness.render('That user already owns the ShEx document.',
                await authBusiness.getUserLogged(),
                await shExDocBusiness.getShExDocsByOwner(await authBusiness.getUserLogged()),
                await shExDocBusiness.getShExDocById(docId));
            return;
        }

        await shExDocBusiness.addOwner(docId, req.body.newOwner);
        res.redirect("/shexDoc/".concat(docId.toString()));
    }
}

export {PostAddOwnerCommand};