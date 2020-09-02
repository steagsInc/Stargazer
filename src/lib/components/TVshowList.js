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
      <div style={styles.list} className="directories">
      {listItems}
      </div>
    )
  }

  _episodesItem(media,key){
    return(
      <div style={styles.item} key={media} onClick={() => this._playMedia(media)}>
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
      <div style={styles.list} className="directories">
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
        <p>{media}</p>
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
   this.props.dispatch({ type: 'SET_SELECTED', value:media})
 }

  render(){
  const media = this.props.media
  return (
    <div style={styles.Window} className="Main">
    {this._seasonsList(media.content)}
    {this._episodesList(media.content[this.state.selectedSeason])}
    </div>
  );
}
}

const styles = {
  Window : {
    flex:1,
    height:"20%",
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
    backgroundColor:'#00000055',
    borderRadius:10
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
  season : {
    width:100,
    height:50,
    backgroundColor:"#272050",
    border:"solid",
    borderRadius:10,
    borderWidth:"1",
    borderColor:"black",
    display:'flex',
    alignItems:"center",
    justifyContent:'center'
  },
  item : {
    width:100,
    height:100,
    backgroundColor:"#272050",
    border:"solid",
    borderRadius:10,
    borderWidth:"1",
    borderColor:"black",
    display:'flex',
    alignItems:"center",
    justifyContent:'center'
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
