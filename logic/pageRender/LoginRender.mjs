import {PO_Render} from "./PO_Render.mjs";

class LoginRender extends PO_Render {
    constructor(request, response, logicFactory) {
        super(request, response, logicFactory, 'login.pug', PO_Render.WEBSITE_NAME.concat(' - Log in'));
    }
}

export {LoginRender};