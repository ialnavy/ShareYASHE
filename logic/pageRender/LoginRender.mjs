import {PO_Render} from "./PO_Render.mjs";

class LoginRender extends PO_Render {
    constructor(request, response, logicFactory) {
        super(request, response, logicFactory, 'login.pug', 'ShareYASHE - Log in');
    }
}

export {LoginRender};