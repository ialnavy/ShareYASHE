import {PO_Render} from "../PO_Render.mjs";

class ShExDocRender extends PO_Render {
    constructor(request, response, logicFactory) {
        super(request, response, logicFactory, 'shExDoc/shExDoc.pug',
            PO_Render.WEBSITE_NAME.concat(' - Edit shareable ShEx document'));
    }

    async _getAdditionalRenderParameters(renderParameters) {
        // This method may be overrided by subclasses to add more parameters to the view engine
        let shExDocsLogic = await this.logicFactory.forShExDocs();
        renderParameters["shExDoc"] = await shExDocsLogic.findById(
            (new String(this.request.params.shExDocId)).toString());
        return renderParameters;
    }

}

export {ShExDocRender};