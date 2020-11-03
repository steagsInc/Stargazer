import React from 'react';
import { connect } from 'react-redux'

import TVshowList from './TVshowList'

import { ReactComponent as Gear } from '../res/gear.svg'

class MediaLibrary extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      selectedTVshow : null
    }
  }

  _tvShow(){
    if(this.state.selectedTVshow===null) return null;
    return(<TVshowList media={this.state.selectedTVshow} />)
  }

  _list(object){
    if(object===undefined) return;
    var listItems= []
    for (let [key, value] of Object.entries(object)){
      listItems.push(this._listItem(value,key))
    }
    return(
      <div style={styles.list} className="directories">
      {listItems}
      </div>
    )
  }

  backgroundImage = function(url) {
   return {
     backgroundImage: `url(${window.request.imgBaseURL+url})`,
     backgroundSize:"100px 150px",
     backgroundPosition:"center"
   }
 }

 _playMedia(media){
   this.props.dispatch({ type: 'SET_SELECTED', value:media.path})
 }

 _selectTvShow(media){
   this.setState({selectedTVshow:media})
 }

  _listItem(media,index){
    let backgroundImg = media.api!==undefined ? this.backgroundImage(media.api.poster_path) : null
    let callback = (media.type==="movie" ? () => this._playMedia(media) : () => this._selectTvShow(media) )
    return(
      <div style={{...styles.item,...backgroundImg}} key={index} onClick={callback}>
      </div>
    )
  }

  _settingsCallback = () => {
    this.props.dispatch({ type: 'SWITCH_SETTINGS_WINDOW'})
  }

  _settings(){
    let right = (this.props.settingsWindowOpen ? {right:"30%"} : {right:0});
    return(
      <Gear style={{...styles.gear,...right}} alt='Settings' onClick={this._settingsCallback}/>
    )
  }

  render(){
  const media = this.props.media
  return (
    <div style={styles.Window} className="Main">
      <h2 >MediaLibrary</h2>
      <div style={styles.content}>
      <h3 >Tv Show</h3>
      {this._tvShow()}
      {this._list(media.tv)}
      <h3 >Movie</h3>
      {this._list(media.movie)}
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
  },
  content : {
    flex:1,
    width:"90%",
    display: "flex",
    flexDirection:"column",
    alignItems:"flex-start",
  },
  list : {
    display: "flex",
    flexDirection:"row",
    flexWrap:'nowrap',
    overflow:"hidden",
    overflowX: 'scroll'
  },
  item : {
    margin:2,
    width:100,
    height:150,
    backgroundColor:"#272050",
    border:"solid",
    borderRadius:10,
    borderWidth:"1",
    borderColor:"black",
  },
  gear : {
    position:"absolute",
    fill:"white",
    padding: 10,
    width:40,
    height:40,
    top:0,
    backgroundColor:"#160030",
    border:"solid",
    borderWidth:2,
    borderRightColor:"#160030",
    borderTopColor:"#160030",
    borderLeftColor:"#160d50",
    borderBottomColor:"#160d50",
    borderBottomLeftRadius:5,
  }
}

const mapStateToProps = (state) => {
  return {
    reload : state.reload,
    media:window.data.media,
    settingsWindowOpen : state.settingsWindowOpen,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaLibrary);