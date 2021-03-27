import React from 'react';
import { connect } from 'react-redux'
import Store from '../../store/configureStore'

const windowWidth = 1/4

class SettingsWindow extends React.Component {

  _addDirectorySync = () => {
    window.data.addDirectorySynch();
    if(this.props.apikey === undefined ){
      window.alert("No TMDB api key !");
    }
    else{
      if(window.data.newFiles!=null) Store.dispatch({ type: 'SET_SUMMARY',value:window.request.tmdbFilesSync(window.data.newFiles,this.props.apikey)})
      Store.dispatch({ type: 'RELOAD'})
    }

  }

  _addDirectory = () => {
    Store.dispatch({ type: 'LOADING'})
    window.data.addDirectory(() => {
      Store.dispatch({ type: 'LOADING'})
      if(this.props.apikey === undefined ){
        window.alert("No TMDB api key !");
      }
      else{
        window.request.tmdbFiles(window.data.newFiles,this.props.apikey,(results) => {
          if(window.data.newFiles!=null) Store.dispatch({ type: 'SET_SUMMARY',value:results})
          Store.dispatch({ type: 'RELOAD'})
        })
    }});

  }

  _changeKey(event){
    Store.dispatch({ type: 'SET_APIKEY', value:event.target.value})
  }

  _clearData = () => {
    window.data.clear()
    Store.dispatch({ type: 'RELOAD'})
  }

  _removeDirectory(index){
    window.data.removeDir(index)
    Store.dispatch({ type: 'RELOAD'})
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

  _listItem(item,index){
    return(
      <div style={styles.item} key={index}>
      <p style={{fontSize:15,marginLeft:100}}>{index}</p>
      <button style={styles.remove} onClick={() => this._removeDirectory(index)}>
        X
      </button>
      </div>
    )
  }

  _apiKey(){
    return(
      <div style={styles.key}>
      <p style={{color:"white",fontSize:15,marginLeft:10,marginRight:10}} >TMDB api key : </p>
      <input style={styles.input} type="text" value={this.props.apikey || ''} onChange={this._changeKey} />
      </div>
    )
  }

  render(){
    const dirs = this.props.dirs;
  return (
    <div style={styles.SettingsWindow}>
      <div style={styles.content}>
        <p style={{fontSize:20,color:"white",}} >directories</p>
        <button style={styles.button} onClick={this._addDirectory}>
          add directory
        </button>
        {this._list(dirs)}
        {this._apiKey()}
        <button style={styles.buttonClear} onClick={this._clearData}>
          Clear
        </button>
      </div>
    </div>
  );
}
}

const styles = {
  SettingsWindow : {
    position: "absolute",
    width:window.screen.availWidth*windowWidth,
    right:0,
    height:"100%",
    backgroundColor:"#00000088",
    backdropFilter: "blur(4px)",
  },
  content:{
    height:"100%",
    width:"100%",
    paddingLeft: 15,
  },
  button : {
    width:"90%",
    height:"5%",
    backgroundColor:"#192553",
    border: 0,
    color:"white",
    margin:5,
    borderRadius:5,
  },
  remove : {
    width:"10%",
    height:"100%",
    backgroundColor:"#b30000",
    border: 0,
    color:"white",
    borderRadius:5,
  },
  buttonClear : {
    marginTop:10,
    width:"90%",
    height:"5%",
    borderBottom:"solid",
    borderBottomWidth:"2",
    borderColor:"#160d50",
    backgroundColor:"#b30000",
    color:"white",
    borderWidth:2,
    borderRadius:10,
  },
  list : {
    width:"90%",
    height:"5%",
    margin:5,
    borderRadius:5,
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:'flex-start'
  },
  item : {
    width:"100%",
    flex:1,
    backgroundColor:"#7402a844",
    borderRadius:5,
    borderBottom:"solid",
    borderBottomWidth:"2",
    borderColor:"black",
    display: "flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:'space-between'
  },
  key : {
    display: "flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:'flex-start'
  },
  input : {
    border:0,
    color:"#ddd",
    padding:10,
    borderRadius:5,
    background:"#222222dd"
  }
}

const mapStateToProps = (state) => {
  return {
    reload : state.reload,
    dirs: window.data.dirs,
    apikey: state.apikey,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsWindow);
