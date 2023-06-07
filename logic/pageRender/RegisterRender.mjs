import {PO_Render} from "./PO_Render.mjs";

class RegisterRender extends PO_Render {
    constructor(request, response, logicFactory) {
        super(request, response, logicFactory, 'register.pug', PO_Render.WEBSITE_NAME.concat(' - Register'));
    }
}

export {RegisterRender};