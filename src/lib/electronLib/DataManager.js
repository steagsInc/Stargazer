const storage = require('electron-json-storage-sync');
const {dialog} = require('electron').remote;
const fs = require('fs');

window.loaded = window.loaded + ",DataManager"

window.data = {};

//storage.clear();

window.data.newFiles = null;
window.data.newDir = null; // add directory
window.data.newDirectories = null; // update availible files

window.data.dirs = storage.get('dirs')['data'];
if (window.data.dirs===undefined) window.data.dirs = {}

window.data.media = storage.get('media')['data'];
if (window.data.media===undefined) window.data.media = {tv:{},movie:{}}

window.data.LastDate = storage.get('LastDate')['data'];
if (window.data.LastDate===undefined) window.data.LastDate = null

checkChangedFiles();

storage.set('LastDate',new Date());

window.data.addDirectory = function(){

  let dir = dialog.showOpenDialogSync({
    title:"Select a folder",
    properties: ["openDirectory"]
  });

  if (dir===undefined){
    return;
  }

  exist = false

  Object.keys(window.data.dirs).forEach(d => {
    if(d===dir){
      console.log(d+","+dir)
      exist = true;
    }
  })

  if(!exist){
    window.data.newDir=dir;
    results = window.parser.getAllFiles(dir);
    files = window.filterMovies(results)
    window.data.newData=files;

    window.data.newFiles = orderFiles(files,dir);

  }
}

window.data.addSubtitles = function(){
  const items = dialog.showOpenDialogSync({filters: [
    {name: "subtitles", extensions: ["srt"]},
    {name: "All files", extensions: ["*"]},
  ]});

  return items
}

window.data.confirmeNewFiles = function(files){

  Object.keys(files).forEach((type, i) => {
    if(window.data.media[type]===undefined) window.data.media[type] = {}
    Object.keys(files[type]).forEach((item, i) => {
      window.data.media[type][item]=files[type][item]
    });
  });

  if(window.data.newDir!=null){
    window.data.dirs[window.data.newDir]=window.data.newData;
  }else{
    window.data.dirs = window.data.newDirectories;
    window.data.newDirectories = null;
  }


  console.log(window.data.dirs)

  storage.set('dirs',window.data.dirs);

  storage.set('media',window.data.media);

  window.data.newFiles = null;
  window.data.newData = null;
  window.data.newDir = null;
}

window.data.cancelAdd = function(){

  window.data.newFiles = null;
  window.data.newDir=null;
  storage.set('dirs',window.data.dirs);

}

window.data.removeDir = function(dir){

  Object.keys(window.data.media).forEach((type, i) => {
    Object.keys(window.data.media[type]).forEach((item, i) => {
      if(window.data.media[type][item].dir === dir) delete window.data.media[type][item]
    });
  });

  delete window.data.dirs[dir];
  storage.set('dirs',window.data.dirs);
  storage.set('media',window.data.media);

}

window.data.clear = function(){

  result = storage.clear()
  window.data.dirs = {}
  window.data.media = {}

}

function orderFiles(files,dir){

  var media = {}

  media.tv = {}
  media.movie = {}

  Object.values(files).forEach(file => {
    if (file.season!==undefined && file.episode!==undefined){
      if(media.tv[file.title]=== undefined)media.tv[file.title] = {type:"tv",dir:dir[0],content:{}};
      if(media.tv[file.title].content[file.season]== undefined)media.tv[file.title].content[file.season] = {}
      media.tv[file.title].content[file.season][file.episode]=file.url
    }
    else if(file.episode!==undefined){
      if(media.tv[file.title]=== undefined) media.tv[file.title] = {type:"tv",dir:dir[0],content:{}};
        media.tv[file.title].content[file.episode]=file.url
    }
    else if(file.resolution!==undefined){
      if(media.movie[file.title]=== undefined)media.movie[file.title] = {type:"movie",dir:dir[0],year:file.year,path:""};
      media.movie[file.title].path=file.url
    }
  })

  return media
}

function checkChangedFiles(){

  let changed = false

  changed = window.checkremovedFiles();

  newFiles = {}

  window.data.newDirs = {};

  window.data.newDirectories={};

  Object.keys(window.data.dirs).forEach(d => {
    result = window.parser.getAllFiles(d);
    files =  window.filterMovies(result);

    window.data.newDirectories[d] = window.filterMovies(result);

    Object.keys(files).forEach((url, i) => {
      if(Object.keys(window.data.dirs[d]).includes(url)) delete files[url]
    });
    let nf = orderFiles(files,d)
    Object.keys(nf).forEach((type, i) => {
      Object.keys(nf[type]).forEach((name, i) => {
          if(newFiles[type]===undefined) newFiles[type]={};
          newFiles[type][name] = nf[type][name]
      });
    });
  })

  window.data.newFiles = Object.keys(newFiles).length===undefined || Object.keys(newFiles).length===0 ? null : newFiles;

}
