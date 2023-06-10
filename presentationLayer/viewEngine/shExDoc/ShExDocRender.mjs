import {PO_Render} from "../PO_Render.mjs";

class ShExDocRender extends PO_Render {
    constructor(request, response, logicFactory) {
        super(request, response, logicFactory, 'shExDoc/shExDoc.pug',
            PO_Render.WEBSITE_NAME.concat(' - Edit shareable ShEx document'));
    }
}

export {ShExDocRender};