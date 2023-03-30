import {PO_Render} from "./PO_Render.mjs";

class IndexRender extends PO_Render {
    constructor(request, response, logicFactory) {
        super(request, response, logicFactory, 'index.pug', 'ShareYASHE');
    }
}

export {IndexRender};