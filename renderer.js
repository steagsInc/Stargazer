// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
document.getElementById('loadDirectory').addEventListener('click',function(){
    let dir =window.chooseDirectory();
    window.addDirectory(dir[0]);
  });

let shows = document.getElementById('shows');
let movies = document.getElementById('movies');

function reloadList(files){

  while (shows.firstChild) {
    shows.removeChild(shows.firstChild);
  }

  Object.keys(data).forEach(function(title) {
    if(data[title].type==="tvshow"){
      var node = document.createElement("DIV");
      node.className = "media";
      node.addEventListener('click',function(){
        selectMedia(title,data[title]);},false);
      var textnode = document.createTextNode(title);
      node.appendChild(textnode);
      shows.appendChild(node);
    }
  })

  while (movies.firstChild) {
    movies.removeChild(movies.firstChild);
  }

  Object.keys(data).forEach(function(title) {
    if(data[title].type==="movie"){
      var node = document.createElement("DIV");
      node.className = "media";
      node.addEventListener('click',function(){
        selectMedia(title,data[title]);},false);
      var textnode = document.createTextNode(title);
      node.appendChild(textnode);
      movies.appendChild(node);
   }
  })

}

let player = document.getElementById('player')
let titleBox = player.getElementsByTagName('h2')[0];

selectMedia = function(title,media){
  console.log("click")
  titleBox.innerHTML = title;
}
