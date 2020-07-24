import React from 'react';
import { connect } from 'react-redux'
import Store from '../../store/configureStore'

const windowWidth = 1/5

class SettingsWindow extends React.Component {

  _addDirectory = () => {
    window.data.addDirectory()
    Store.dispatch({ type: 'SET_SUMMARY',value:window.request.tmdbFiles(window.data.media,this.props.apikey)})
    Store.dispatch({ type: 'RELOAD'})
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
      <div style={styles.item} key={item}>
      <p style={{fontSize:15}}>{item}</p>
      <button onClick={() => this._removeDirectory(index)}>
        X
      </button>
      </div>
    )
  }

  _apiKey(){
    return(
      <div style={styles.key}>
      <p style={{color:"white",fontSize:15,marginRight:10}} >api key</p>
      <input type="text" value={this.props.apikey || ''} onChange={this._changeKey} />
      </div>
    )
  }

  render(){
    const dirs = this.props.dirs;
  return (
    <div style={styles.SettingsWindow}>
      <h3 style={{color:"white"}}>Settings</h3>
      <h5 style={{color:"white"}} >directories</h5>
      <button style={styles.button} onClick={this._addDirectory}>
        add directory
      </button>
      {this._list(dirs)}
      {this._apiKey()}
      <button style={styles.buttonClear} onClick={this._clearData}>
        Clear
      </button>
    </div>
  );
}
}

const styles = {
  SettingsWindow : {
    position:"absolute",
    width:window.screen.availWidth*windowWidth,
    right:0,
    height:"100%",
    borderLeft:"solid",
    borderWidth:2,
    borderColor:"#160d50",
    backgroundColor:"#160030",
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:'flex-start'
  },
  button : {
    width:"90%",
    height:"5%",
    borderBottom:"solid",
    borderBottomWidth:"2",
    borderColor:"#160d50",
    backgroundColor:"#192553",
    color:"white",
    borderWidth:2,
    borderRadius:10,
  },
  buttonClear : {
    marginTop:"10%",
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
    height:"10%",
    border:"solid",
    borderWidth:5,
    borderRadius:10,
    borderColor:"#160d50",
    backgroundColor:"#272050",
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:'flex-start'
  },
  item : {
    width:"100%",
    height:"10%",
    borderBottom:"solid",
    borderBottomWidth:"2",
    borderColor:"black",
    display: "flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:'space-around'
  },
  key : {
    display: "flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:'space-around'
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
