import React from 'react';
import { connect } from 'react-redux'
import Store from '../../store/configureStore'

class Summary extends React.Component {

  constructor(props){
    super(props)
    if(window.data.newFiles!=null) Store.dispatch({ type: 'SET_SUMMARY',value:window.request.tmdbFiles(window.data.newFiles,this.props.apikey)})
    else Store.dispatch({ type: 'SET_SUMMARY',value:null});
  }

  state = {
    reload:false
  }

  _selectResult(event,media){
    media.selected = media.results[event.target.value]
    this.setState({reload:!this.state.reload})
  }

  _resultsToSelect(media){
    var results = media.results
    return(
      <select onChange={(event) => this._selectResult(event,media)}>
      {
        Object.keys(results).map((index) => {
          var name = results[index].title===undefined ? results[index].name : results[index].title
          return(<option value={index} key={results[index].id}>{name}</option>)
        })
      }
      </select>
    )
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

  _removeNewFile(index,type){
    console.log(index)
    delete this.props.data[index]
    delete this.props.newFiles[type][index]
    console.log(this.props.newFiles)
    this.setState({reload:!this.state.reload})
  }

  _listItem(media,index){
    var name = index
    if (media.results.length === 0) return null;
    return(
      <div style={styles.item} key={name}>
      <p style={{fontSize:20}}>{name}</p>
      {this._resultsToSelect(media)}
      <img style={{height:"100%",width:"10%"}} src={window.request.imgBaseURL+media.selected.poster_path} alt='' />
      <button onClick={() => this._removeNewFile(name,media.type)}>
        X
      </button>
      </div>
    )
  }

  _confirm = () => {
    for (let [name, info] of Object.entries(this.props.data)){
      info.results = undefined;
      this.props.newFiles[info.type][name].api = info.selected
    }
    window.data.confirmeNewFiles(this.props.newFiles)
    window.request.setThumbnail(window.data.media,this.props.apikey)
    Store.dispatch({ type: 'SET_SUMMARY',value:null})
    Store.dispatch({ type: 'RELOAD'})
  }

  _cancel = () => {
    window.data.cancelAdd()
    Store.dispatch({ type: 'SET_SUMMARY',value:null})
  }

  render(){
  //Store.dispatch({ type: 'RESET'})
  if(this.props.data === null) return null;
  return (
    <div style={styles.Window} >
      <h2 >Summary</h2>
      {this._list(this.props.data)}
      <div style={styles.buttons}>
        <button style={styles.confirm} onClick={this._confirm}>
          Confirm
        </button>
        <button style={styles.cancel} onClick={this._cancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
}

const styles = {
  Window : {
    position:"absolute",
    flex:1,
    height:"80%",
    width:"80%",
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:'center',
    backgroundColor:"#180f50",
    border:"solid",
    borderColor:"black",
    borderWidth:2,
    borderRadius:10,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  buttons : {
    height:"5%",
    width:"90%",
    display: "flex",
    flexDirection:"row",
    alignItems:"flex-start",
    justifyContent:'flex-start'
  },
  confirm : {
    width:"50%",
    height:"100%",
    borderBottom:"solid",
    borderBottomWidth:"2",
    borderColor:"#160d50",
    backgroundColor:"#32a852",
    color:"white",
    borderWidth:2,
    borderRadius:10,
  },
  cancel : {
    width:"50%",
    height:"100%",
    borderBottom:"solid",
    borderBottomWidth:"2",
    borderColor:"#160d50",
    backgroundColor:"#ff5050",
    color:"white",
    borderWidth:2,
    borderRadius:10,
  },
  content : {
    flex:1,
    height:"100%",
    width:"100%",
    display: "flex",
    flexDirection:"column",
    alignItems:"flex-start",
    justifyContent:'flex-start'
  },
  list : {
    flex:1,
    border:"solid",
    borderWidth:5,
    borderRadius:10,
    borderColor:"#160d50",
    display: "flex",
    flexDirection:"column",
    flexWrap:'nowrap',
    alignItems:"center",
    justifyContent:'flex-start',
    overflow:"hidden",
    overflowY: 'scroll'
  },
  item : {
    margin:2,
    width:"100%",
    height:100,
    backgroundColor:"#272050",
    display: "flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:'space-around',
  }
}

const mapStateToProps = (state) => {
  return {
    data:state.loadingSummary,
    reload : state.reload,
    apikey: state.apikey,
    newFiles:window.data.newFiles
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
