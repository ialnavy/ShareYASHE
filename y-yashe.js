import * as Y from 'yjs'
import {WebsocketProvider} from 'y-websocket'
import {CodemirrorBinding} from 'y-codemirror'
import 'codemirror/mode/javascript/javascript.js'
import YASHE from 'yashe';


window.addEventListener('load', () => {
    const ydoc = new Y.Doc()
    const provider = new WebsocketProvider(
        'wss://demos.yjs.dev',
        'codemirror-demo',
        ydoc
    )
    const ytext = ydoc.getText('codemirror')
    const editorContainer = document.createElement('textarea')
    editorContainer.setAttribute('id', 'editor')
    document.body.insertBefore(editorContainer, null)

    const editor = YASHE(editorContainer, {
        lineNumbers: true
    })

    const binding = new CodemirrorBinding(ytext, editor, provider.awareness)

    const connectBtn = /** @type {HTMLElement} */ (document.getElementById('y-connect-btn'))
    connectBtn.addEventListener('click', () => {
        if (provider.shouldConnect) {
            provider.disconnect()
            connectBtn.textContent = 'Connect'
        } else {
            provider.connect()
            connectBtn.textContent = 'Disconnect'
        }
    })

    // @ts-ignore
    window.example = {provider, ydoc, ytext, binding, Y}
})