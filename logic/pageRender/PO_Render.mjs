class PO_Render {
    constructor(request, response, logicFactory, renderTemplate, title = 'ShareYASHE') {
        this.request = request;
        this.response = response;
        this.logicFactory = logicFactory;
        this.renderTemplate = (new String(renderTemplate)).toString();
        this.title = (new String(title)).toString();
        this.message = null;
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
            renderParameters['ownedSheets'] = await this.getOwnedSheets(username);
        }

        return renderParameters;
    }

    async getOwnedSheets(username) {
        let sheets = [];
        let sheetsRepository = await this.logicFactory.forSheets();
        if ((await sheetsRepository.countSheetsByUsername(username)) > 0) {
            let sheetsCursor = await sheetsRepository.getSheetsByUsername(username);
            while (await sheetsCursor.hasNext()) {
                let persistentSheet = await sheetsCursor.next();
                sheets.push({
                    sheetId: persistentSheet._id.toString(),
                    title: persistentSheet.title.toString()
                });
            }
        }
        console.log(sheets);
        return sheets;
    }

    async render(message = null) {
        this.message = message;
        this.response.render(this.renderTemplate, await this.getRenderParameters());
    }
}

export {PO_Render};