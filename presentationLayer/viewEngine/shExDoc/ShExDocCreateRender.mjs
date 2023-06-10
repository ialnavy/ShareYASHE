import {PO_Render} from "../PO_Render.mjs";

class ShExDocCreateRender extends PO_Render {
    constructor(request, response, logicFactory) {
        super(request, response, logicFactory, 'shExDoc/shExDocCreate.pug',
            PO_Render.WEBSITE_NAME.concat(' - Create shareable ShEx document'));
    }
}

export {ShExDocCreateRender};