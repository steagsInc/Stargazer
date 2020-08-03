import React from 'react';
import { connect } from 'react-redux'
import Store from '../../store/configureStore'
import SettingsWindow from "../components/SettingsWindow.js"
import MediaLibrary from "../components/MediaLibrary.js"
import Summary from "../components/Summary.js"
import Player from "../components/Player.js"

class Main extends React.Component {

  constructor(props){
    super(props)
    //Store.dispatch({ type: 'RESET'})
  }

  render(){
    if(this.props.selected_media){
      return (
        <div style={styles.MainWindow}>
          <Player />
        </div>
      );
    }
    return (
      <div style={styles.MainWindow}>
        <MediaLibrary/>
        <SettingsWindow/>
        <Summary data={this.props.loadingSummary} />
      </div>
  );
}
}

const styles = {
  MainWindow:{
    height:"100vh",
    width:"100vw",
    backgroundColor:"#120850",
    display:"flex",
    flexDirection:"row",
    fontSize:"calc(10px + 2vmin)",
    color:"#f4a261",
    overflow:"hidden",
  }
}

const mapStateToProps = (state) => {
  return {
    loadingSummary:state.loadingSummary,
    reload : state.reload,
    selected_media : state.selected_media,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
