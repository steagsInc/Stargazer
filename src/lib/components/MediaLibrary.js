import React from 'react';
import { connect } from 'react-redux'

import TVshowList from './TVshowList'

import { ReactComponent as Gear } from '../res/gear.svg'
import { ReactComponent as Arrow } from '../res/arrow.svg'

const scroll = 100

const posterHeight = 187.5
const posterWidth = 125

const trackedTitle = "Continue"

const fillColor = "#fff"

const windowWidth = 1/4

class MediaLibrary extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      selectedTVshow : null,
      trackedOffset:0,
      tvOffset:0,
      movieOffset:0
    }
  }

  _tvShow(){
    if(this.state.selectedTVshow===null) return null;
    return(<TVshowList media={this.state.selectedTVshow} />)
  }

  _list(object,type){
    var offset = null
    if(type==="Tv Show"){
      offset = {transform: `translate(${this.state.tvOffset}px, 0px)`}
    }else if(type==="Movie"){
      offset = {transform: `translate(${this.state.movieOffset}px, 0px)`}
    }else{
      offset = {transform: `translate(${this.state.trackedOffset}px, 0px)`}
    }
    if(object===undefined) return;
    var listItems= []
    for (let [key, value] of Object.entries(object)){
      if(type===trackedTitle){
        if(!this.props.media[value.type].hasOwnProperty(value.key)){
          object.remove(key)
        }else{
          listItems.push(this._trackedItem(value,key));
        }
      }
      else listItems.push(this._listItem(value,key));
    }
    return(
      <div style={{...styles.list,...offset}} className="directories">
      {listItems}
      </div>
    )
  }

 _playMedia(media,index,progression=0){
   this.props.dispatch({ type: 'SET_SELECTED', value:{media:media,key:index,progression:progression}})
 }

 _selectTvShow(media,index){
   this.setState({selectedTVshow:{media:media,key:index}})
 }

  _listItem(media,index){
    let callback = (media.type==="movie" ? () => this._playMedia(media,index) : () => this._selectTvShow(media,index) )
    let img = (media.api!==undefined ? <img style={styles.itemImage} src={window.request.imgBaseURL+media.api.poster_path} alt='' onClick={callback}/> : null)
    return(
      <div style={styles.item} key={media.title}>
        {img}
        <p style={{fontSize: 15,textAlign: 'center'}}>{media.title}</p>
      </div>
    )
  }

  _trackedItem(item,index){
    var media = (item.type==="movie" ? this.props.media[item.type][item.key] : this.props.media[item.type][item.key].content[item.season][item.episode]);

    let img = (this.props.media[item.type][item.key].api!==undefined ?
       <img style={styles.itemImage}
       src={window.request.imgBaseURL+this.props.media[item.type][item.key].api.poster_path}
       alt='' onClick={() => this._playMedia(media,item.key,item.progression)}/>
       : null)
    let subtitles = (item.type==="tv" ? <p style={{fontSize: 12,textAlign: 'center'}}>{"season:"+item.season+"\nepisode:"+item.episode}</p> : null)

    let progressionItem = {width:item.progression*100+"%",...styles.progressionBar}

    return(
      <div style={styles.item} key={item.key}>
        {img}
        <div style={styles.remove}>
          <p style={{fontSize: 15,textAlign: 'center',margin:3.5}}
            onClick={()=>{window.tracker.removeMedia(item.key)
                          this.props.dispatch({ type: 'RELOAD'})}}>X</p>
        </div>
        <div style={styles.progression}>
          <div style={progressionItem}/>
        </div>
        <p style={{fontSize: 14,textAlign: 'center'}}>{media.title}</p>
        {subtitles}
      </div>
    )
  }

  _settingsCallback = () => {
    this.props.dispatch({ type: 'SWITCH_SETTINGS_WINDOW'})
  }

  _settings(){
    let right = (this.props.settingsWindowOpen ? {right:window.screen.availWidth*windowWidth} : {right:0});
    return(
      <Gear style={{...styles.gear,...right}} alt='Settings' onClick={this._settingsCallback}/>
    )
  }

  _goLeft(type){
    if(type===trackedTitle && this.state.trackedOffset<0) this.setState({tvOffset:this.state.trackedOffset+scroll});
    if(type==="Tv Show" && this.state.tvOffset<0) this.setState({tvOffset:this.state.tvOffset+scroll});
    if(type==="Movie" && this.state.movieOffset<0) this.setState({movieOffset:this.state.movieOffset+scroll});
  }

  _goRight(type){
    if(type===trackedTitle && this.state.trackedOffset>(Object.keys(this.props.tracked).length-3)*-scroll) this.setState({tvOffset:this.state.trackedOffset-scroll});
    if(type==="Tv Show" && this.state.tvOffset>(Object.keys(this.props.media.tv).length-3)*-scroll) this.setState({tvOffset:this.state.tvOffset-scroll});
    if(type==="Movie" && this.state.movieOffset>(Object.keys(this.props.media.movie).length-3)*-scroll) this.setState({movieOffset:this.state.movieOffset-scroll});
  }

  _titleButtons(title){
    var right = {transform:"scale(-1,1)"}
    return(
    <div key={title} style={styles.title}>
      <p style={{fontSize: 30}}>{title}</p>
      <Arrow style={styles.arrow} alt='Left' onClick={() => this._goLeft(title)} className="Button"/>
      <Arrow style={{...styles.arrow,...right}} alt='Left' onClick={() => this._goRight(title)} className="Button"/>
    </div>)
  }

  render(){
  const media = this.props.media
  return (
    <div style={styles.Window}>
      <div style={styles.content}>
      {this._titleButtons(trackedTitle)}
      {this._list(this.props.tracked,trackedTitle)}
      {this._tvShow()}
      {this._titleButtons("Tv Show")}
      {this._list(media.tv,"Tv Show")}
      {this._titleButtons("Movie")}
      {this._list(media.movie,"Movie")}
      {this._settings()}
      </div>
    </div>
  );
}
}

const styles = {
  Window : {
    flex:1,
    width:"70%",
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
    overflowY:"scroll",
    overflowX:"hidden"
  },
  content : {
    flex:1,
    width:"90%",
    display: "flex",
    flexDirection:"column",
    alignItems:"flex-start",
  },
  title:{
    display: "flex",
    flexDirection:"row",
    alignItems:"center",
  },
  list : {
    position: "relative",
    display: "flex",
    flexDirection:"row",
    flexWrap:'nowrap',
    overflowX: 'scroll',
    overflowY:'hidden'
  },
  item : {
    margin:5,
    width:posterWidth,
    height:"100%",
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
  },
  gear : {
    position:"absolute",
    fill:"white",
    padding: 10,
    width:40,
    height:40,
    top:0,
    backgroundColor:"#00000088",
    backdropFilter: "blur(4px)",
    borderBottomLeftRadius:5,
  },
  arrow : {
    fill:fillColor,
    margin:10,
    width:30,
    height:30,
  },
  itemImage:{
    width:posterWidth,
    height:posterHeight,
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,1)"
  },
  remove : {
    position:"absolute",
    width:25,
    height:25,
    backgroundColor:"#b30000dd",
    border: 0,
    color:"white",
    borderBottomLeftRadius:5,
    transform: "translate(50px, 0px)",
  },
  progression : {
    position:"absolute",
    width:125,
    height:5,
    color:"white",
    transform: "translate(-62px, 183px)",
  },
  progressionBar : {
    height:"100%",
    backgroundColor:"#b30000dd",
    transform: "translate(62px, 0px)",
  }
}

const mapStateToProps = (state) => {
  return {
    reload : state.reload,
    media:window.data.media,
    tracked:window.tracker.data,
    settingsWindowOpen : state.settingsWindowOpen,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaLibrary);
