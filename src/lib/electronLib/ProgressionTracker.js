const storage = require('electron-json-storage-sync');
const {dialog} = require('electron').remote;
const fs = require('fs');

window.loaded = window.loaded + ",ProgressionTracker"

window.tracker = {}

window.tracker.data = [];

window.tracker.data = storage.get('tracker')['data'];
if (window.tracker.data===undefined) window.tracker.data = [];

window.tracker.addMovie = function(key,progression){

  window.tracker.removeMedia(key)

  window.tracker.data.unshift({type:"movie",key:key,progression:progression})

  window.data.save('tracker',window.tracker.data)

}

window.tracker.addTv = function(key,s,e,progression){

  window.tracker.removeMedia(key)

  window.tracker.data.unshift({type:"tv",key:key,season:s,episode:e,progression:progression})

  window.data.save('tracker',window.tracker.data)

}

window.tracker.removeMedia = function(key){

  for (let i = 0; i < window.tracker.data.length; i++) {
    if(window.tracker.data[i].key === key){
      window.tracker.data.remove(i)
    }
  }

  window.data.save('tracker',window.tracker.data)

}

window.tracker.progressShow = function(key,s,e){

  var ep = null

  for (let i = 0; i < window.tracker.data.length; i++) {
    if(window.tracker.data[i].key === key){
      ep = window.tracker.data[i]
      window.tracker.data.remove(i)
    }
  }

  if(Object.keys(window.data.media.tv[key].content[s]).length>ep.episode){
    if(ep===null) return window.tracker.addTv(key,s,e+1,0);
    ep.episode+=1
    window.tracker.data.unshift(ep)
  }else if(Object.keys(window.data.media.tv[key].content).length<ep.season){
    if(ep===null) return window.tracker.addTv(key,s+1,Object.keys(window.data.media.tv[key].content[ep.season+1])[0],0);
    ep.episode=Object.keys(window.data.media.tv[key].content[ep.season+1])[0]
    ep.season+=1
    window.tracker.data.unshift(ep)
  }

  window.data.save('tracker',window.tracker.data)

}

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
