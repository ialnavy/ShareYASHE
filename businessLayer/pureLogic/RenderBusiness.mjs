import {AbstractBusiness} from "../AbstractBusiness.mjs";

class RenderBusiness extends AbstractBusiness {
    static WEBSITE_NAME = 'ShareYASHE';
    constructor(app, mongoClient, req, res, title, renderTemplate) {
        super(app, mongoClient, req, res);
        this.title = title;
        this.renderTemplate = renderTemplate;
    }

    async render(message= "", username = undefined, ownedShExDocs = undefined, shExDoc = undefined) {
        let renderParameters = {};
        renderParameters['title'] = RenderBusiness.WEBSITE_NAME.concat(" ").concat((new String(this.title)).toString());
        renderParameters['message'] = message;
        if (username !== undefined)
            renderParameters['username'] = username;
        if (ownedShExDocs !== undefined)
            renderParameters['ownedShExDocs'] = ownedShExDocs;
        if (shExDoc !== undefined)
            renderParameters["shExDoc"] = shExDoc;
        this.res.render(this.renderTemplate, renderParameters);
    }
}
export {RenderBusiness};