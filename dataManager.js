const storage = require('electron-json-storage');
const {dialog} = require('electron').remote;
const fs = require('fs');

dirs = undefined;
data = undefined;

/*storage.clear(function(error) {
if (error) throw error;
});*/

storage.get('dirs',function(error,loadedData) {
if (error) throw error;
dirs = loadedData
});

storage.get('data',function(error,loadedData) {
if (error) throw error;
data = loadedData;
});

window.addDirectory = function(dir){

  if(!(dir in dirs)){
    dirs[Object.keys(dirs).length]=dir;
    window.getAllFiles(dir, function(err,results){
        if(err) throw err;
        files = window.filterMovies(results)
        refreshData(files);
    });

    storage.set('dirs',dirs,function(error) {
    if (error) throw error;
    });

  }
}

function refreshData(files){

  console.log(files);

  files.forEach(file => {
    if (file.season!==undefined && file.episode!==undefined){
      if(data[file.title]=== undefined){data[file.title] = {type:"tvshow",list:{}}}
      if(data[file.title].list[file.season]=== undefined){data[file.title][file.season] = {}}
      data[file.title][file.season][file.episode]=file.url
    }
    else if(file.episode!==undefined){
      if(data[file.title]=== undefined){data[file.title] = {type:"tvshow"}}
        data[file.title].list[file.episode]=file.url
    }
    else if(file.resolution!==undefined){
      if(data[file.title]=== undefined){data[file.title] = {type:"movie",path:""}}
      data[file.title].path=file.url
    }
  })

  console.log(data);

  storage.set('data',data,function(error,loadedData) {
  if (error) throw error;
  data = loadedData;
  });

}
