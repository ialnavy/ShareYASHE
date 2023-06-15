const {ObjectId} = require("mongodb");

module.exports = {

    mongoClient: null,
    app: null,

    init: function (app, mongoClient) {
        this.app = app;
        this.mongoClient = mongoClient;
    },

    /* COMMAND EXECUTOR */
    forExecutor: async function() {
        let CommandExecutor = (await import('./CommandExecutor.mjs')).CommandExecutor;
        return new CommandExecutor(this.app, this.mongoClient, ObjectId);
    },

    /* INDEX */
    forGetIndexCommand: async function () {
        let GetIndexCommand = (await import('./GetIndexCommand.mjs')).GetIndexCommand;
        return new GetIndexCommand(this.app, this.mongoClient, ObjectId);
    },

    /* SHEX DOCS */
    forGetCreateShExDocCommand: async function () {
        let GetCreateShExDocCommand = (await import('./ShExDoc/GetCreateShExDocCommand.mjs')).GetCreateShExDocCommand;
        return new GetCreateShExDocCommand(this.app, this.mongoClient, ObjectId);
    }, forPostCreateShExDocCommand: async function () {
        let PostCreateShExDocCommand = (await import('./ShExDoc/PostCreateShExDocCommand.mjs')).PostCreateShExDocCommand;
        return new PostCreateShExDocCommand(this.app, this.mongoClient, ObjectId);
    }, forGetShExDocCommand: async function () {
        let GetShExDocCommand = (await import('./ShExDoc/GetShExDocCommand.mjs')).GetShExDocCommand;
        return new GetShExDocCommand(this.app, this.mongoClient, ObjectId);
    },

    /* USERS */
    forGetRegisterCommand: async function () {
        let GetRegisterCommand = (await import('./Auth/GetRegisterCommand.mjs')).GetRegisterCommand;
        return new GetRegisterCommand(this.app, this.mongoClient, ObjectId);
    }, forPostRegisterCommand: async function () {
        let PostRegisterCommand = (await import('./Auth/PostRegisterCommand.mjs')).PostRegisterCommand;
        return new PostRegisterCommand(this.app, this.mongoClient, ObjectId);
    }, forGetLoginCommand: async function () {
        let GetLoginCommand = (await import('./Auth/GetLoginCommand.mjs')).GetLoginCommand;
        return new GetLoginCommand(this.app, this.mongoClient, ObjectId);
    }, forPostLoginCommand: async function () {
        let PostLoginCommand = (await import('./Auth/PostLoginCommand.mjs')).PostLoginCommand;
        return new PostLoginCommand(this.app, this.mongoClient, ObjectId);
    }, forGetLogoutCommand: async function () {
        let GetLogoutCommand = (await import('./Auth/GetLogoutCommand.mjs')).GetLogoutCommand;
        return new GetLogoutCommand(this.app, this.mongoClient, ObjectId);
    }
};