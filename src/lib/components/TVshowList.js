import React from 'react';
import { connect } from 'react-redux'

class TVshowList extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      selectedSeason : 1
    }
  }

  _episodesList(object){
    if(object===undefined) return;
    let listItems= []
    for (let [key, value] of Object.entries(object)){
      listItems.push(this._episodesItem(value,key))
    }
    return(
      <div style={styles.list}>
      {listItems}
      </div>
    )
  }

  backgroundImage = function(url) {
   return {
     backgroundImage: `url(${window.request.imgBaseURL+url})`,
     backgroundSize:"cover",
     backgroundPosition:"center"
   }
 }

  _episodesItem(media,key){
    let backgroundImg = media.thumbnail!==false ? this.backgroundImage(media.thumbnail) : null
    return(
      <div style={styles.item} key={media.path} onClick={() => this._playMedia(media)}>
        <img style={styles.itemImage} src={window.request.imgBaseURL+media.thumbnail} alt=''/>
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
    return(
      <div style={styles.season} key={media} onClick={() => this._selectSeason(media)}>
        <p style={styles.seasonText}>{"season "+media}</p>
      </div>
    )
  }

 _playMedia(media){
   this.props.dispatch({ type: 'SET_SELECTED', value:media.path})
 }

  render(){
    const media = this.props.media
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
    backgroundColor:'#00000055',
    borderRadius:10,
  },
  list : {
    display: "flex",
    flexDirection:"row",
    flexWrap:'nowrap',
    overflowX: 'scroll',
  },
  season : {
    width:100,
    height:50,
    margin:5,
    backgroundColor:"#272050",
    border:"solid",
    borderRadius:10,
    borderWidth:1,
    borderColor:"black",
    display:'flex',
    alignItems:"center",
    justifyContent:'center'
  },
  seasonText:{
    fontSize:20
  },
  item : {
    width:150,
    height:150,
    marginLeft:5,
    backgroundColor:"#151020",
    border:"solid",
    borderRadius:10,
    borderWidth:1,
    borderColor:"black",
    display:'flex',
    flexDirection:"column",
    alignItems:"center",
    justifyContent:'center'
  },
  itemImage:{
    width:150,
    height:100,
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
