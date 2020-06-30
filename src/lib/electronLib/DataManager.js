const storage = require('electron-json-storage-sync');
const {dialog} = require('electron').remote;
const fs = require('fs');

window.loaded = window.loaded + ",DataManager"

window.data = {};

loadedData = storage.get('dirs');
window.data.dirs = loadedData['data']
if (window.data.dirs===undefined) window.data.dirs = {}

loadedMedia = storage.get('media');
window.data.media = loadedMedia['data']
if (window.data.media===undefined) window.data.media = {}


window.data.updateMedia = function(media){
  storage.set('media',media);

  loadedMedia = storage.get('media');
  window.data.media = loadedMedia['data']
  if (window.data.media===undefined) window.data.media = {}
}

window.data.addDirectory = function(){

  let dir = dialog.showOpenDialogSync({
    title:"Select a folder",
    properties: ["openDirectory"]
  });

  if (dir===undefined){
    return;
  }

  exist = false

  Object.values(window.data.dirs).forEach(d => {
    if(d===dir){
      console.log(d+","+dir)
      exist = true;
    }
  })

  if(!exist){
    window.data.dirs[Object.keys(window.data.dirs).length]=dir;
    results = window.parser.getAllFiles(dir);
    files = window.filterMovies(results)
    refreshData(files);

    storage.set('dirs',window.data.dirs);

  }
}

window.data.removeDir = function(key){

  delete window.data.dirs[key];
  window.data.reloadDirs();
  storage.set('dirs',window.data.dirs);

}

window.data.clear = function(){

  result = storage.clear()
  window.data.dirs = {}
  window.data.media = {}

}

window.data.reloadDirs = function(){
  if(Object.keys(window.data.dirs).length != 0){
    Object.values(window.data.dirs).forEach((dir) => {
      window.data.media = {}
      results = window.parser.getAllFiles(dir);
      files = window.filterMovies(results)
      refreshData(files);
    });
  }else{
    result = storage.clear()
    window.data.media = {}
  }
}

function refreshData(files){

  if (window.data.media.tv === undefined) window.data.media.tv = {}
  if (window.data.media.movie === undefined) window.data.media.movie = {}

  files.forEach(file => {
    if (file.season!==undefined && file.episode!==undefined){
      if(window.data.media.tv[file.title]=== undefined)window.data.media.tv[file.title] = {type:"tv",content:{}};
      if(window.data.media.tv[file.title].content[file.season]== undefined)window.data.media.tv[file.title].content[file.season] = {}
      window.data.media.tv[file.title].content[file.season][file.episode]=file.url
    }
    else if(file.episode!==undefined){
      if(window.data.media.tv[file.title]=== undefined) window.data.media.tv[file.title] = {type:"tv",content:{}};
        window.data.media.tv[file.title].content[file.episode]=file.url
    }
    else if(file.resolution!==undefined){
      if(window.data.media.movie[file.title]=== undefined)window.data.media.movie[file.title] = {type:"movie",year:file.year,path:""};
      window.data.media.movie[file.title].path=file.url
    }
  })

  console.log(window.data.media)

  storage.set('media',window.data.media);

}
