const {ObjectId} = require("mongodb");

module.exports = {

    mongoClient: null,
    app: null,

    init: function (app, mongoClient) {
        this.app = app;
        this.mongoClient = mongoClient;
    },

    /* INDEX */
    forGetIndexCommand: async function (req, res) {
        let CommandExecutor = (await import('./CommandExecutor.mjs')).CommandExecutor;
        let GetIndexCommand = (await import('./GetIndexCommand.mjs')).GetIndexCommand;

        let commandExecutor = new CommandExecutor(this.app, this.mongoClient, ObjectId);
        let getIndexCommand = new GetIndexCommand(this.app, this.mongoClient, ObjectId);

        await commandExecutor.execute(req, res, getIndexCommand);
    },

    /* SHEX DOCS */
    forGetCreateShExDocCommand: async function (req, res) {
        let CommandExecutor = (await import('./CommandExecutor.mjs')).CommandExecutor;
        let GetCreateShExDocCommand = (await import('./ShExDoc/GetCreateShExDocCommand.mjs')).GetCreateShExDocCommand;

        let commandExecutor = new CommandExecutor(this.app, this.mongoClient, ObjectId);
        let getCreateShExDocCommand = new GetCreateShExDocCommand(this.app, this.mongoClient, ObjectId);

        await commandExecutor.execute(req, res, getCreateShExDocCommand);
    },

    forPostCreateShExDocCommand: async function (req, res) {
        let CommandExecutor = (await import('./CommandExecutor.mjs')).CommandExecutor;
        let PostCreateShExDocCommand = (await import('./ShExDoc/PostCreateShExDocCommand.mjs')).PostCreateShExDocCommand;

        let commandExecutor = new CommandExecutor(this.app, this.mongoClient, ObjectId);
        let postCreateShExDocCommand = new PostCreateShExDocCommand(this.app, this.mongoClient, ObjectId);

        await commandExecutor.execute(req, res, postCreateShExDocCommand);
    },

    forGetShExDocCommand: async function (req, res) {
        let CommandExecutor = (await import('./CommandExecutor.mjs')).CommandExecutor;
        let GetShExDocCommand = (await import('./ShExDoc/GetShExDocCommand.mjs')).GetShExDocCommand;

        let commandExecutor = new CommandExecutor(this.app, this.mongoClient, ObjectId);
        let getShExDocCommand = new GetShExDocCommand(this.app, this.mongoClient, ObjectId);

        await commandExecutor.execute(req, res, getShExDocCommand);
    },

    forGetLeaveOwnershipCommand: async function(req, res) {
        let CommandExecutor = (await import('./CommandExecutor.mjs')).CommandExecutor;
        let GetLeaveOwnershipCommand = (await import('./ShExDoc/GetLeaveOwnershipCommand.mjs')).GetLeaveOwnershipCommand;

        let commandExecutor = new CommandExecutor(this.app, this.mongoClient, ObjectId);
        let getLeaveOwnershipCommand = new GetLeaveOwnershipCommand(this.app, this.mongoClient, ObjectId);

        await commandExecutor.execute(req, res, getLeaveOwnershipCommand);
    },

    forPostAddOwnerCommand: async function(req, res) {
        let CommandExecutor = (await import('./CommandExecutor.mjs')).CommandExecutor;
        let PostAddOwnerCommand = (await import('./ShExDoc/PostAddOwnerCommand.mjs')).PostAddOwnerCommand;

        let commandExecutor = new CommandExecutor(this.app, this.mongoClient, ObjectId);
        let postAddOwnerCommand = new PostAddOwnerCommand(this.app, this.mongoClient, ObjectId);

        await commandExecutor.execute(req, res, postAddOwnerCommand);
    },

    /* USERS */
    forGetRegisterCommand: async function (req, res) {
        let CommandExecutor = (await import('./CommandExecutor.mjs')).CommandExecutor;
        let GetRegisterCommand = (await import('./Auth/GetRegisterCommand.mjs')).GetRegisterCommand;

        let commandExecutor = new CommandExecutor(this.app, this.mongoClient, ObjectId);
        let getRegisterCommand = new GetRegisterCommand(this.app, this.mongoClient, ObjectId);

        await commandExecutor.execute(req, res, getRegisterCommand);
    },

    forPostRegisterCommand: async function (req, res) {
        let CommandExecutor = (await import('./CommandExecutor.mjs')).CommandExecutor;
        let PostRegisterCommand = (await import('./Auth/PostRegisterCommand.mjs')).PostRegisterCommand;

        let commandExecutor = new CommandExecutor(this.app, this.mongoClient, ObjectId);
        let postRegisterCommand = new PostRegisterCommand(this.app, this.mongoClient, ObjectId);

        await commandExecutor.execute(req, res, postRegisterCommand);
    },

    forGetLoginCommand: async function (req, res) {
        let CommandExecutor = (await import('./CommandExecutor.mjs')).CommandExecutor;
        let GetLoginCommand = (await import('./Auth/GetLoginCommand.mjs')).GetLoginCommand;

        let commandExecutor = new CommandExecutor(this.app, this.mongoClient, ObjectId);
        let getLoginCommand = new GetLoginCommand(this.app, this.mongoClient, ObjectId);

        await commandExecutor.execute(req, res, getLoginCommand);
    },

    forPostLoginCommand: async function (req, res) {
        let CommandExecutor = (await import('./CommandExecutor.mjs')).CommandExecutor;
        let PostLoginCommand = (await import('./Auth/PostLoginCommand.mjs')).PostLoginCommand;

        let commandExecutor = new CommandExecutor(this.app, this.mongoClient, ObjectId);
        let postLoginCommand = new PostLoginCommand(this.app, this.mongoClient, ObjectId);

        await commandExecutor.execute(req, res, postLoginCommand);
    },

    forGetLogoutCommand: async function (req, res) {
        let CommandExecutor = (await import('./CommandExecutor.mjs')).CommandExecutor;
        let GetLogoutCommand = (await import('./Auth/GetLogoutCommand.mjs')).GetLogoutCommand;

        let commandExecutor = new CommandExecutor(this.app, this.mongoClient, ObjectId);
        let getLogoutCommand = new GetLogoutCommand(this.app, this.mongoClient, ObjectId);

        await commandExecutor.execute(req, res, getLogoutCommand);
    }
};