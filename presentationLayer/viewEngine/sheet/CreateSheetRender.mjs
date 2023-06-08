import {PO_Render} from "../PO_Render.mjs";

class CreateSheetRender extends PO_Render {
    constructor(request, response, logicFactory) {
        super(request, response, logicFactory, 'sheet/createSheet.pug', PO_Render.WEBSITE_NAME.concat(' - Create sheet'));
    }
}

export {CreateSheetRender};