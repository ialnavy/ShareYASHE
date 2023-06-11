import * as Y from 'https://esm.sh/yjs@13';
import {WebsocketProvider} from './lib/y-websocket.js';
import {CodemirrorBinding} from './lib/y-codemirror.js';
import {RandomContrastColour} from "./util/RandomContrastColour.mjs";

// Not an ESM Module (must be imported in the HTML <head>):
// import YASHE from 'https://cdn.jsdelivr.net/npm/yashe@1.3.22/dist/yashe.bundled.min.js';

class ShareYASHE_Client {
    static EDITOR_TEXTAREA_SELECTOR = 'body > main > textarea:first-of-type';
    static SHAREYASHE_USERNAME_SCRIPT_SELECTOR = 'head > script:last-of-type';

    constructor() {
        this.username = "";
        this.yDoc = new Y.Doc();
        this.yasheEditor = null;
        this.websocketProvider = null;
        this.codemirrorBinding = null;
        document.addEventListener("DOMContentLoaded", this.createEditor.bind(this));
        window.addEventListener("beforeunload", this.disconnectEditor.bind(this));
    }

    /**
     * This method creates and sets up the ShareYASHE editor after DOM content is fully loaded.
     *
     * @returns {Promise<void>}
     */
    async createEditor() {
        // Retrieve username from dynamically rendered script & remove it from the HTML DOM
        try {
            this.username = shareYASHEusernameGotFromViewEngine;
        } catch (error) {
            this.username = "Anonymous";
        }
        document.querySelector(ShareYASHE_Client.SHAREYASHE_USERNAME_SCRIPT_SELECTOR).remove();

        // Establish WebSocket connection to the doc room
        this.websocketProvider = new WebsocketProvider(
            'wss://'.concat(window.location.hostname.toString()).concat(':1234'),
            this.docID,
            this.yDoc
        );

        // The WebSockets server updates the yDoc so it can be shared by several clients
        this.websocketProvider.on('message', ((event) => {
            let data = JSON.parse(event.data);
            if (data.type === 'yDoc') {
                this.yDoc = Y.Doc.fromJSON(data.yDoc);
            }
        }).bind(this));

        // A YASHE editor, which is running over CodeMirror, is created.
        // Then, it is binded to the WebSocket Provider.
        // This synchronises the editor with the server yDoc.
        // Thus, with the editors of another clients.
        // We can also customise the user awareness.
        this.yasheEditor = YASHE.fromTextArea(
            document.querySelector(ShareYASHE_Client.EDITOR_TEXTAREA_SELECTOR), {
                lineNumbers: true
        });
        this.codemirrorBinding = new CodemirrorBinding(this.yText, this.yasheEditor, this.websocketProvider.awareness);
        // User awareness options
        this.codemirrorBinding.awareness.setLocalStateField('user', {
            // Background colour
            color: RandomContrastColour.getRandomContrastColor('#000000'),
            // Displayed username
            name: this.username
        });

        // The event listeners of the WebsocketProvider can be binded to functions of this class
        this.websocketProvider.on('status', this.onStatus.bind(this));
        this.websocketProvider.on('sync', this.onSync.bind(this));
        this.websocketProvider.on('destroy', this.onDestroy.bind(this));
        this.websocketProvider.on('error', this.onError.bind(this));

        // These attributes must be exported to the 'example' variable,
        // so libraries can access them.
        let provider = this.websocketProvider;
        let binding = this.codemirrorBinding;
        let ydoc = this.yDoc;
        let ytext = this.yText;
        // @ts-ignore
        window.example = {provider, ydoc, ytext, binding, Y};
    }

    /**
     * This method disconnects the WebSocket when the window is closed.
     *
     * @returns {Promise<void>}
     */
    async disconnectEditor() {
        if (this.websocketProvider != undefined && this.websocketProvider !== null)
            this.websocketProvider.disconnect();
    }

    /* WebsocketProvider EVENT LISTENERS */

    /**
     * Event listener for provider's "status" event
     *
     * @param event
     * @returns {Promise<void>}
     */
    async onStatus(event) {
        if (event.status === 'connecting') {
            // Starting connection
            console.log('Connecting to room "'.concat(this.docID).concat('"'));
        } else if (event.status === 'connected') {
            // Start collaborating in the room
            console.log('Connected to room "'.concat(this.docID).concat('"'));
        } else if (event.status === 'disconnected') {
            // Handle disconnection
            console.log('Disconnected from the WebSocket server');
        } else if (event.status === 'stopped') {
            // The provider has been stopped
            console.log('The provider has been stopped');
        }
    }

    /**
     * Event listener for provider's "sync" event
     *
     * @param synced
     * @returns {Promise<void>}
     */
    async onSync(synced) {
        if (synced) {
            console.log('Initial sync completed');
            // The shared document is synchronized and ready for collaboration
        }
    }

    /**
     * Event listener for provider's "destroy" event
     *
     * @returns {Promise<void>}
     */
    async onDestroy() {
        // Perform cleanup tasks or any necessary actions upon provider destruction
        console.log('WebsocketProvider has been destroyed');
    }

    /**
     * Handle errors that occur during WebSocket connection
     *
     * @param error
     * @returns {Promise<void>}
     */
    async onError(error) {
        console.error('WebSocket connection error:', error);
    }

    /* GETTER METHODS */

    get docID() {
        let currentURL = new URL((new String(window.location.href)).toString());
        let absolutePathName = (new String(currentURL.pathname)).toString();
        let absolutePathNameSubstrings = absolutePathName.split("/");
        return (new String( (new String( //
            absolutePathNameSubstrings[absolutePathNameSubstrings.length - 1] //
                )).toString().split(".")[0]//
        )).toString();
    }

    get yText() {
        return this.yDoc.getText();
    }

}

new ShareYASHE_Client();