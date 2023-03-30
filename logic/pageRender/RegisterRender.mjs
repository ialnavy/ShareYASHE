import {PO_Render} from "./PO_Render.mjs";

class RegisterRender extends PO_Render {
    constructor(request, response, logicFactory) {
        super(request, response, logicFactory, 'register.pug', 'ShareYASHE - Register');
    }
}

export {RegisterRender};