import * as Y from 'https://esm.sh/yjs@13';
import {WebsocketProvider} from './lib/y-websocket.js';
import {CodemirrorBinding} from './lib/y-codemirror.js';

// Not an ESM Module (must be imported in the HTML <head>):
// import YASHE from 'https://cdn.jsdelivr.net/npm/yashe@1.3.22/dist/yashe.bundled.min.js';

class ShareYASHE_Client {
    static EDITOR_TEXTAREA_SELECTOR = 'body > main > textarea';
    static EDITOR_BUTTON_SELECTOR = 'body > main > button';

    constructor() {
        this.editor = null;
        document.addEventListener("DOMContentLoaded", this.createEditor.bind(this));
    }

    createEditor() {
        let ydoc = new Y.Doc();
        let provider = new WebsocketProvider(
            'wss://demos.yjs.dev',
            'codemirror-demo',
            ydoc
        );
        let ytext = ydoc.getText('codemirror')

        this.editor = YASHE.fromTextArea(
            document.querySelector(ShareYASHE_Client.EDITOR_TEXTAREA_SELECTOR), {
                lineNumbers: true
            });

        let binding = new CodemirrorBinding(ytext, this.editor, provider.awareness);

        let connectBtn = document.querySelector(ShareYASHE_Client.EDITOR_BUTTON_SELECTOR);
        connectBtn.addEventListener('click', () => {
            if (provider.shouldConnect) {
                provider.disconnect();
                connectBtn.textContent = 'Connect';
            } else {
                provider.connect();
                connectBtn.textContent = 'Disconnect';
            }
        });

        // @ts-ignore
        window.example = {provider, ydoc, ytext, binding, Y};
    }
}

new ShareYASHE_Client();