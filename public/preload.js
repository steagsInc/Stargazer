window.loaded = "preload"
require('../src/lib/electronLib/LocalParser.js')
require('../src/lib/electronLib/DataManager.js')
require('../src/lib/JsonRequest.js')
window.electron = {};
var electron = require('electron')
window.electron.dialog = electron.remote.dialog;
window.electron.window = electron.remote.getCurrentWindow();
