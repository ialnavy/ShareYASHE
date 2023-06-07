import {PO_Render} from "../PO_Render.mjs";

class CreateSheetRender extends PO_Render {
    constructor(request, response, logicFactory) {
        super(request, response, logicFactory, 'sheet/createSheet.pug', PO_Render.WEBSITE_NAME.concat(' - Create sheet'));
    }
    async _getAdditionalRenderParameters(renderParameters) {
        // This parameter is used to import dynamically the requested libraries by YASHE
        renderParameters['requestedScripts'] = ['simpleyashe.js'];

        return renderParameters;
    }
}

export {CreateSheetRender};