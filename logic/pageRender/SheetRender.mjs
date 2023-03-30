import {PO_Render} from "./PO_Render.mjs";

class SheetRender extends PO_Render {
    constructor(request, response, logicFactory) {
        super(request, response, logicFactory, 'sheet.pug', 'ShareYASHE - Sheet');
    }
}

export {SheetRender};