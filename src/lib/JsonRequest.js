window.loaded = window.loaded + ",json Reqest"

window.request = {}

window.request.imgBaseURL = "https://image.tmdb.org/t/p/original";

window.request.tmdbFiles = function(media,apikey){
  results = {}

  if(media.movie!=undefined)

  Object.keys(media.movie).forEach((name) => {
    response = JsonRequest("https://api.themoviedb.org/3/search/movie?api_key="+apikey+"&query="+name+"&year="+media.movie[name].year)
    results[name]={}
    results[name].type = "movie"
    results[name].results = response.results
    results[name].selected = response.results[0]
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

window.request.setThumbnail = function(media,apikey){

  Object.keys(media.tv).forEach((name) => {
    Object.keys(media.tv[name].content).forEach((s) => {
      Object.keys(media.tv[name].content[s]).forEach((e) => {
        request = "https://api.themoviedb.org/3/tv/"+media.tv[name].api.id+"/season/"+s+"/episode/"+e+"/images?api_key="+apikey
        response = JsonRequest("https://api.themoviedb.org/3/tv/"+media.tv[name].api.id+"/season/"+s+"/episode/"+e+"/images?api_key="+apikey)
        if(!("success" in response)){
          if(response.stills.length>0) media.tv[name].content[s][e].thumbnail=response.stills[0].file_path;
        } else{
          media.tv[name].content[s][e].thumbnail=false
        }
      });
    });
  });

  window.data.save('media',media)

}

function JsonRequest(yourUrl){

    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);

    return JSON.parse(Httpreq.responseText);
}
