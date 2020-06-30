window.loaded = "preload"
require('../src/lib/electronLib/LocalParser.js')
require('../src/lib/electronLib/DataManager.js')
require('../src/lib/JsonRequest.js')
window.electron = {};
window.electron.dialog = require('electron').remote.dialog;
