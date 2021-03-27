import React from 'react';
import { connect } from 'react-redux'
import Store from '../../store/configureStore'

const posterHeight = 120
const posterWidth = 80

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
      <select style={styles.choice} onChange={(event) => this._selectResult(event,media)}>
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
      <p style={{fontSize:20,width:"50%",}}>{name}</p>
      {this._resultsToSelect(media)}
      <img style={styles.itemImage} src={window.request.imgBaseURL+media.selected.poster_path} alt='' />
      <button style={styles.remove} onClick={() => this._removeNewFile(name,media.type)}>
        X
      </button>
      </div>
    )

  }

  _confirm = () => {
    for (let [name, info] of Object.entries(this.props.data)){
      info.results = undefined;
      this.props.newFiles[info.type][name].api = info.selected
      this.props.newFiles[info.type][name].title = info.type==="tv" ? info.selected.name : info.selected.title
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
      <h2 >Show added</h2>
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
    width:"65%",
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:'center',
    backgroundColor:"#00000088",
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
    width:"100%",
    display: "flex",
    flexDirection:"row",
    alignItems:"flex-start",
    justifyContent:'space-around'
  },
  remove : {
    fontSize:20,
    width:"5%",
    height:"40%",
    backgroundColor:"#b30000",
    marginRight:"2%",
    border: 0,
    color:"white",
    borderRadius:5,
  },
  confirm : {
    width:"25%",
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
    width:"25%",
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
    width:"100%",
    borderRadius:5,
    border:"solid",
    borderWidth:"1",
    borderColor:"black",
    display: "flex",
    flexDirection:"column",
    flexWrap:'nowrap',
    alignItems:"center",
    justifyContent:'flex-start',
    overflow:"hidden",
    overflowY: 'scroll'
  },
  item : {
    width:"100%",
    flex:1,
    backgroundColor:"#00000088",
    borderRadius:5,
    borderBottom:"solid",
    borderBottomWidth:"2",
    borderColor:"#222222dd",
    display: "flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:'space-between'
  },
  itemImage:{
    width:posterWidth,
    height:posterHeight,
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,1)",
    marginBottom:"1%",
    marginTop:"1%",
  },
  choice : {
    border:0,
    width:"25%",
    color:"#ddd",
    padding:10,
    borderRadius:5,
    background:"#222222dd"
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
