class PO_Render {
    static WEBSITE_NAME = 'ShareYASHE';
    constructor(request, response, logicFactory, renderTemplate, title = PO_Render.WEBSITE_NAME) {
        this.request = request;
        this.response = response;
        this.logicFactory = logicFactory;
        this.renderTemplate = (new String(renderTemplate)).toString();
        this.title = (new String(title)).toString();
        this.message = null;
    }

    async render(message = null) {
        this.message = message;
        this.response.render(this.renderTemplate, await this.getRenderParameters());
    }

    async _getAdditionalRenderParameters(renderParameters) {
        // This method may be overrided by subclasses to add more parameters to the view engine
        return renderParameters;
    }

    async getRenderParameters() {
        let authLogic = await this.logicFactory.forAuth(this.request.session);

        let renderParameters = {};
        renderParameters['title'] = this.title;

        if (!(this.message === null || typeof (this.message) === 'undefined'
            || this.message === '' || this.message.length === 0))
            renderParameters['message'] = this.message;

        if (authLogic.isUserLogged()) {
            let username = authLogic.getLoggedUsername();
            renderParameters['username'] = username;
            renderParameters['ownedShExDocs'] = await this.getOwnedShExDocs(username);
        }

        return (await this._getAdditionalRenderParameters(renderParameters));
    }

    async getOwnedShExDocs(username) {
        let shExDocs = [];

        let shExDocsRepository = null;
        try {
            shExDocsRepository = await this.logicFactory.forShExDocs();
        } catch (error) {
            return shExDocs;
        }

        try {
            shExDocs = await shExDocsRepository.getShExDocsByOwner(username);
        } catch (error) {
            return shExDocs;
        }

        return shExDocs;
    }

}

export {PO_Render};