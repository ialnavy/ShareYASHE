import {BusinessFactory} from "../businessLayer/BusinessFactory.mjs";
import {AbstractAppLayerCommand} from "./AbstractAppLayerCommand.mjs";

class CommandExecutor extends AbstractAppLayerCommand {
    async execute(req, res, command) {
        let renderingBusiness = BusinessFactory.forRenderError(this.app, this.mongoClient, req, res);
        try {
            command.execute(req, res);
        } catch(error) {
            console.log("UNEXPECTED ERROR!");
            console.log(error);
            await renderingBusiness.render("An unexpected error happened. Please, provide feedback to the administrator of this website.");
        }
    }
}

export {CommandExecutor};