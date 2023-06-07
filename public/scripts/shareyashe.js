import * as Y from 'https://esm.sh/yjs@13';
import {WebsocketProvider} from './lib/y-websocket.js';
import {CodemirrorBinding} from './lib/y-codemirror.js';

// Not an ESM Module (must be imported in the HTML <head>):
// import YASHE from 'https://cdn.jsdelivr.net/npm/yashe@1.3.22/dist/yashe.bundled.min.js';

class ShareYASHE_Client {
    static EDITOR_TEXTAREA_SELECTOR = 'body > main > textarea:first-of-type';

    constructor() {
        this.yDoc = new Y.Doc();
        this.yasheEditor = null;
        this.websocketProvider = null;
        this.codemirrorBinding = null;
        document.addEventListener("DOMContentLoaded", this.createEditor.bind(this));
    }

    get yText() {
        return this.yDoc.getText();
    }

    async createEditor() {
        this.websocketProvider = new WebsocketProvider(
            'ws://127.0.0.1:1234',
            '',
            this.yDoc
        );

        this.yasheEditor = YASHE.fromTextArea(
            document.querySelector(ShareYASHE_Client.EDITOR_TEXTAREA_SELECTOR), {
                lineNumbers: true
        });

        this.codemirrorBinding = new CodemirrorBinding(this.yText, this.yasheEditor, this.websocketProvider.awareness);

        this.websocketProvider.on('status', this.onStatus.bind(this));
        this.websocketProvider.on('sync', this.onSync.bind(this));
        this.websocketProvider.on('destroy', this.onDestroy.bind(this));
        this.websocketProvider.on('error', this.onError.bind(this));

        this.yasheEditor.setValue("");
        let message = "PREFIX :       \x3Chttp://example.org/\x3E\n";
        message = message.concat("PREFIX schema: \x3Chttp://schema.org/\x3E\n");
        message = message.concat("PREFIX xsd:  \x3Chttp://www.w3.org/2001/XMLSchema#\x3E\n");
        message = message.concat("\n");
        message = message.concat(":User {\n");
        message = message.concat("  schema:birthDate     xsd:date?  ;\n");
        message = message.concat("  schema:gender        [ schema:Male schema:Female ] OR xsd:string ;\n");
        message = message.concat("  schema:knows         IRI @:User*\n");
        message = message.concat("}\n");
        this.yasheEditor.setValue(message);

        let provider = this.websocketProvider;
        let binding = this.codemirrorBinding;
        let ydoc = this.yDoc;
        let ytext = this.yText;
        // @ts-ignore
        window.example = {provider, ydoc, ytext, binding, Y};
    }

    /**
     * Event listener for provider's "status" event
     *
     * @param event
     * @returns {Promise<void>}
     */
    async onStatus(event) {
        if (event.status === 'connecting') {
            // Starting connection
            console.log('connecting to room "${roomName}"');
        } else if (event.status === 'connected') {
            // Start collaborating in the room
            console.log('Connected to room "${roomName}"');
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
}

new ShareYASHE_Client();