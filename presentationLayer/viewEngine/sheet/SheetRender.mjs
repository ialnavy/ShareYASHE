import {PO_Render} from "../PO_Render.mjs";

class SheetRender extends PO_Render {
    constructor(request, response, logicFactory) {
        super(request, response, logicFactory, 'sheet/sheet.pug', PO_Render.WEBSITE_NAME.concat(' - Edit sheet'));
    }
}

export {SheetRender};