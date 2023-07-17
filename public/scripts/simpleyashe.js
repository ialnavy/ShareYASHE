import * as Y from './lib/yjs.js';
import {WebsocketProvider} from './lib/y-websocket.js';
import {CodemirrorBinding} from './lib/y-codemirror.js';

// Not an ESM Module (must be imported in the HTML <head>):
// import YASHE from 'https://cdn.jsdelivr.net/npm/yashe@1.3.22/dist/yashe.bundled.min.js';

class SimpleYASHE_Client {
    static EDITOR_TEXTAREA_SELECTOR = 'body > main > form > textarea:first-of-type';

    constructor() {
        this.yDoc = new Y.Doc();
        this.yasheEditor = null;
        document.addEventListener("DOMContentLoaded", this.createEditor.bind(this));
    }

    get yText() {
        return this.yDoc.getText();
    }

    async createEditor() {
        this.yasheEditor = YASHE.fromTextArea(
            document.querySelector(SimpleYASHE_Client.EDITOR_TEXTAREA_SELECTOR), {
                lineNumbers: true
        });

        this.yasheEditor.setValue("");

        let ydoc = this.yDoc;
        let ytext = this.yText;
        // @ts-ignore
        window.example = {ydoc, ytext, Y};
    }

}

new SimpleYASHE_Client();