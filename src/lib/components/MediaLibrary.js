import React from 'react';
import { connect } from 'react-redux'
import Store from '../../store/configureStore'

class MediaLibrary extends React.Component {

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

  _listItem(media,index){
    let backgroundImg = media.api!==undefined ? this.backgroundImage(media.api.poster_path) : null
    //Store.dispatch({ type: 'SET_SELECTED',value:"D:/rick.and.morty.s04e03.720p.hdtv.x264-mtg[eztv].mkv"})
    return(
      <div style={{...styles.item,...backgroundImg}} key={index}>
      </div>
    )
  }

  render(){
  const media = this.props.media
  return (
    <div style={styles.Window} className="Main">
      <h2 >MediaLibrary</h2>
      <div style={styles.content}>
      <h3 >Tv Show</h3>
      {this._list(media.tv)}
      <h3 >Movie</h3>
      {this._list(media.movie)}
      </div>
    </div>
  );
}
}

const styles = {
  Window : {
    flex:1,
    width:"100%",
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
  }
}

const mapStateToProps = (state) => {
  return {
    reload : state.reload,
    media:window.data.media
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaLibrary);
