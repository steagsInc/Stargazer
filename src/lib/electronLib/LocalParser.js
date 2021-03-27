const fs = require('fs');
const path = require('path')
const tnp = require('torrent-name-parser');
var ffmpeg = require('fluent-ffmpeg');
const {dialog} = require('electron').remote;

window.loaded = window.loaded + ",LocalParser"

window.parser = {}

window.parser.getAllFilesSynch = function(dir,date) {

  var results = [];
  list = fs.readdirSync(dir.toString(),{withFileTypes: true});
    var pending = list.length;
    if (!pending) return null;
    list.forEach(function(file) {
      file = path.resolve(dir.toString(), file.name);
      if (file.search("\\System Volume Information")!=-1) return;
      stat = null;
      try {
        fs.accessSync(file);
        stat = fs.statSync(file);
      } catch (err) {
        console.error('no access! '+file);
      }
      if (stat && stat.isDirectory()) {
        res = window.parser.getAllFilesSynch(file,date);
        results = results.concat(res);
      } else {
        if(date != null){
          if(date < stat.mtime)results.push(file);
        }else{
          results.push(file);
        }
      }
      });
    return results
};

window.parser.getAllFiles = async function(dir,date,callback,dirs) {
  var results = [];
  var promise=0;
  var list = null;
  this.dirs = dirs
  fs.readdir(dir.toString(),{withFileTypes: true},async (err,list)=>{
      var pending = list.length;
      if (!pending){
        callback(null);
        return null;
      };
      promise=pending;
      await Promise.all(list.map(async (file)=>{
        file = path.resolve(dir.toString(), file.name);
        if (file.search("\\System Volume Information")!=-1){
          promise--;
          if(promise==0){
            //console.log("end",dir)
            callback(results);
          };
        }
        stat = null;
        fs.access(file,fs.constants.F_OK,async(err)=>{
          if(err!=null)console.log(err)
          fs.stat(file,false,async (err,stat)=>{
            if (err) {
              console.error('no access! '+file);
              promise--;
              if(promise==0){
                //console.log("end",dir)
                callback(results);
              };
            }
            else if (stat && stat.isDirectory()) {
              window.parser.getAllFiles(file,date,(res)=>{
                if(res!=null)results = results.concat(res);
                promise--;
                if(promise==0){
                  //console.log("end",dir)
                  callback(results);
                }},this.dirs);
            } else {
              if(date != null){
                if(date < stat.mtime)results.push(file);
              }else{
                if(err!=null)console.log(err)
                let fileParsed = filterMovie(file)
                if(fileParsed!=null) results.push(fileParsed);
                promise--;
                if(promise==0){
                  //console.log("end",file)
                  callback(results);
                };
              }
            }});
        });
      }));
  })
};

var customRegex = function(){
  var epNum = '([0-9]+)'
  var title = '([a-zA-Z( |.)]+)'
  var extra = '([a-zA-Z0-9\\s_\\\.\\-\\(\\):]+)'

  //var expression = prompt("t : tile, s: season number, e : episode number , x : extra");

  var expression = "e - t - x"

  expression = expression.replace('e',epNum)
  expression = expression.replace('s',epNum)
  expression = expression.replace('t',title)
  expression = expression.replace('x',extra)

  console.log(expression)

}

function nameParser(file) {

  var name = new RegExp("^(.+)\/([^\/]+)$")
  var pathReg = new RegExp("(.*\/).*")

  file = file.replace(/[#\\]/g,"/")

  var imgPath = file.match(pathReg)[1]

  var parsed = tnp(file.match(name)[2])

  if (parsed.title===""){
    return null
  }

  if (parsed.season){
    return {title:parsed.title.toLowerCase(),season:parsed.season,episode:parsed.episode,episodeName:parsed.episodeName,url:file,extra:parsed.extra}
  }
  else{
    return {title:parsed.title.toLowerCase(),year:parsed.year,resolution:parsed.resolution,url:file,extra:parsed.extra,thumbnail:imgPath}
  }

}

function filterMovie(file){

  var regex = new RegExp('(.mkv|.mp4|.avi)$')

  filtered = {}

  var fileParsed = null;

  if(regex.test(file)){
    fileParsed = nameParser(file)
    //filtered[fileParsed.url] = fileParsed
  }

  return fileParsed;
}

window.filterMovies = function(files){

  var regex = new RegExp('(.mkv|.mp4|.avi)$')

  filtered = {}

  files.forEach(file => {
    if(regex.test(file)){
      var fileParsed = nameParser(file)
      if(fileParsed!==null){
        filtered[fileParsed.url] = fileParsed
      }
    }
  })

  return filtered;

}

window.checkremovedFiles = function(){

  var media = window.data.media

  var deletion = false;

  Object.keys(media.movie).forEach((name) => {
    if (!fs.existsSync(media.movie[name].path)) {
      delete media.movie[name]
      deletion=true
    }
  });

  Object.keys(media.tv).forEach((name) => {
    Object.keys(media.tv[name].content).forEach((season) => {
      Object.keys(media.tv[name].content[season]).forEach((episode) => {
        if (!fs.existsSync(media.tv[name].content[season][episode].path)) {
          delete media.tv[name].content[season][episode]
          deletion=true
        }
      });
    });
  });

  return deletion;

}
