window.loaded = window.loaded + ",json Reqest"

window.request = {}

window.request.imgBaseURL = "https://image.tmdb.org/t/p/original";

window.request.tmdbFilesSync = function(media,apikey){
  results = {}

  if(media.movie!=undefined)

  Object.keys(media.movie).forEach((name) => {
    response = JsonRequest("https://api.themoviedb.org/3/search/movie?api_key="+apikey+"&query="+name+"&year="+media.movie[name].year)
    if (response.results.length===0){
      delete media.movie[name];
    }
    else {
      results[name]={}
      results[name].type = "movie"
      results[name].results = response.results
      results[name].selected = response.results[0]
    }
  });

  if(media.tv!=undefined)

  Object.keys(media.tv).forEach((name) => {
    response = JsonRequest("https://api.themoviedb.org/3/search/tv?api_key="+apikey+"&query="+name)
    results[name]={}
    results[name].type = "tv"
    results[name].results = response.results
    results[name].selected = response.results[0]
  });

  return results
}

window.request.tmdbFiles = function(media,apikey,callback){
  results = {}

  var promise = 0

  if(media.movie!=undefined)

  promise = promise + Object.keys(media.movie).length

  Object.keys(media.movie).forEach((name) => {
    JsonRequest("https://api.themoviedb.org/3/search/movie?api_key="+apikey+"&query="+name+"&year="+media.movie[name].year,(response) => {
      if (response.results.length===0){
        delete media.movie[name];
      }
      else {
        results[name]={}
        results[name].type = "movie"
        results[name].results = response.results
        results[name].selected = response.results[0]
      }
      promise--;
      if(promise==0) callback(results);
    })
  });

  if(media.tv!=undefined)

  promise = promise + Object.keys(media.tv).length;

  Object.keys(media.tv).forEach((name) => {
    JsonRequest("https://api.themoviedb.org/3/search/tv?api_key="+apikey+"&query="+name,(response) => {
      results[name]={}
      results[name].type = "tv"
      results[name].results = response.results
      results[name].selected = response.results[0]
      promise--;
      if(promise==0) callback(results);
    })
  });
}

window.request.setThumbnail = function(media,apikey){


  Object.keys(media.tv).forEach((name) => {
    Object.keys(media.tv[name].content).forEach((s) => {
      Object.keys(media.tv[name].content[s]).forEach((e) => {
        url = "https://api.themoviedb.org/3/tv/"+media.tv[name].api.id+"/season/"+s+"/episode/"+e+"/images?api_key="+apikey
        JsonRequest(url,(response)=>{
          if(!("success" in response)){
            if(response.stills.length>0) media.tv[name].content[s][e].thumbnail=response.stills[0].file_path;
          } else{
            media.tv[name].content[s][e].thumbnail=false
          }
        })
      });
    });
  });

  window.data.save('media',media)

}

function JsonRequestSync(yourUrl){

  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET",yourUrl,false);
  Httpreq.send();
  return JSON.parse(Httpreq.responseText);

}

function JsonRequest(yourUrl,callback){

  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET",yourUrl,true);
  Httpreq.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(JSON.parse(this.responseText));
    }
  };
  Httpreq.send();
}
