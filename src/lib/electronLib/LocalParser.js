const fs = require('fs');
const path = require('path')
const tnp = require('torrent-name-parser');
const {dialog} = require('electron').remote;

window.loaded = window.loaded + ",LocalParser"

window.parser = {}

window.parser.getAllFiles = function(dir) {
  var results = [];
  list = fs.readdirSync(dir.toString(),{withFileTypes: true});
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir.toString(), file.name);
      if (file.search("\\System Volume Information")!=-1) return;
      stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        res = window.parser.getAllFiles(file);
        results = results.concat(res);
      } else {
        results.push(file);
      }
      });
    return results
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

  file = file.replace(/[#\\]/g,"/")

  var parsed = tnp(file.match(name)[2])

  if (parsed.title===""){
    return null
  }

  if (parsed.season){
    return {title:parsed.title.toLowerCase(),season:parsed.season,episode:parsed.episode,episodeName:parsed.episodeName,url:file,extra:parsed.extra}
  }
  else{
    return {title:parsed.title.toLowerCase(),year:parsed.year,resolution:parsed.resolution,url:file,extra:parsed.extra}
  }

}

window.filterMovies = function(files){

  var regex = new RegExp('(.mkv|.mp4|.avi)$')

  filtered = []

  files.forEach(file => {
    if(regex.test(file)){
      var fileParsed = nameParser(file)
      if(fileParsed!==null){
        filtered.push(fileParsed)
      }
    }
  })

  return filtered;

}
