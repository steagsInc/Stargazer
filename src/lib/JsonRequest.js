window.loaded = window.loaded + ",json Reqest"

window.request = {}

window.request.imgBaseURL = "https://image.tmdb.org/t/p/original";

window.request.tmdbFiles = function(media,apikey){
  results = {}

  Object.keys(media.movie).forEach((name) => {
    response = JsonRequest("https://api.themoviedb.org/3/search/movie?api_key="+apikey+"&query="+name+"&year="+media.movie[name].year)
    results[name]={}
    results[name].type = "movie"
    results[name].results = response.results
    results[name].selected = response.results[0]
  });

  Object.keys(media.tv).forEach((name) => {
    response = JsonRequest("https://api.themoviedb.org/3/search/tv?api_key="+apikey+"&query="+name)
    results[name]={}
    results[name].type = "tv"
    results[name].results = response.results
    results[name].selected = response.results[0]
  });

  console.log(results)

  return results
}

function JsonRequest(yourUrl){

    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);

    return JSON.parse(Httpreq.responseText);
}
