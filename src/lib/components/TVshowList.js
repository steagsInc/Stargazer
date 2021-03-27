import React from 'react';
import { connect } from 'react-redux'

class TVshowList extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      selectedSeason : "1"
    }
  }

  _episodesList(object){
    if(object===undefined) return;
    let listItems= []
    for (let [key, value] of Object.entries(object)){
      listItems.push(this._episodesItem(value,key))
    }
    return(
      <div style={styles.itemlist}>
      {listItems}
      </div>
    )
  }

  _episodesItem(media,key){
    let img = media.thumbnail!==false ? <img style={styles.itemImage} src={window.request.imgBaseURL+media.thumbnail} alt=''/> : null
    return(
      <div style={styles.item} key={media.path} onClick={() => this._playMedia(media,key)}>
        {img}
        <p style={{fontSize: 15}}>{"episode "+key}</p>
      </div>
    )
  }

  _seasonsList(object){
    if(object===undefined) return;
    let listItems= []
    for (let key of Object.keys(object)){
      listItems.push(this._seasonItem(key))
    }
    return(
      <div style={styles.list}>
      {listItems}
      </div>
    )
  }

  _selectSeason(key){
    this.setState({selectedSeason:key})
  }

  _seasonItem(media){
    var background = (this.state.selectedSeason===media ? {backgroundColor:'#00000055'} : null)
    return(
      <div style={{...styles.season,...background}} key={media} onClick={() => this._selectSeason(media)}>
        <p style={styles.seasonText}>{"season "+media}</p>
      </div>
    )
  }

 _playMedia(media,key){
   this.props.dispatch({ type: 'SET_SELECTED', value:{media:media,key:this.props.media.key,timecode:0}})
 }

  render(){
    const media = this.props.media.media
    console.log(media)
    return (
      <div style={styles.Window}>
      {this._seasonsList(media.content)}
      {this._episodesList(media.content[this.state.selectedSeason])}
      </div>
    );
}
}

const styles = {
  Window : {
    display: "flex",
    flexDirection:"column",
    alignItems:"flex-start",
    borderRadius:10,
  },
  list : {
    display: "flex",
    flexDirection:"row",
    flexWrap:'nowrap',
    overflowX: 'scroll',
  },
  itemlist : {
    display: "flex",
    flexDirection:"row",
    flexWrap:'nowrap',
    overflowX: 'scroll',
    backgroundColor:'#00000055',
  },
  season : {
    width:150,
    height:50,
    margin:5,
    borderLeft:"solid",
    borderLeftWidth:2,
    borderLeftColor:"#f4a261",
    display:'flex',
    alignItems:"center",
    justifyContent:'center'
  },
  seasonText:{
    fontSize:20
  },
  item : {
    margin:5,
    width:150,
    height:"100%",
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
  },
  itemImage:{
    width:150,
    height:100,
    boxShadow: "5px 5px 5px 0px rgba(0,0,0,1)",
    borderTopLeftRadius:5,
    borderTopRightRadius:5
  }
}

const mapStateToProps = (state) => {
  return {
    reload : state.reload,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TVshowList);
