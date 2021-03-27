import React from 'react';
import { connect } from 'react-redux'
import Loader from "react-loader-spinner";

import SettingsWindow from "../components/SettingsWindow.js"
import MediaLibrary from "../components/MediaLibrary.js"
import Summary from "../components/Summary.js"
import Player from "../components/Player.js"

class Main extends React.Component {

  render(){
    if(this.props.selected_media){
      return (
        <div style={styles.MainWindow}>
          <Player />
        </div>
      );
    }

    var settings = (this.props.settingsWindowOpen ? <SettingsWindow/> : null);

    var loader = (this.props.loading ?
      <div style={styles.loader}>
        <Loader
          type="TailSpin"
          color="#FFF"
        />
      </div> : null);

    return (
      <div style={styles.Background}>
        <div style={styles.MainWindow}>
        <MediaLibrary/>
        {settings}
        <Summary data={this.props.loadingSummary} />
        {loader}
        </div>
      </div>
  );
}
}

const styles = {
  Background:{
    height:"100vh",
    width:"100vw",
    //background:"linear-gradient(to bottom right,#CC0856,#1F1BB2 70%)",
    background:"linear-gradient(to bottom right,#40031b,#0a0838 70%)",
  },
  MainWindow:{
    height:"100vh",
    width:"100vw",
    backgroundColor:"transparent",
    backgroundImage:"url(http://api.thumbr.it/whitenoise-361x370.png?background=4ea6ca00&noise=626262&density=45&opacity=10)",
    backdropFilter: "grayscale(20%)",
    display:"flex",
    flexDirection:"row",
    font: "1.2em Lato, sans-serif",
    fontSize:"calc(10px + 2vmin)",
    textTransform:'capitalize',
    color:"#fff",
    overflow:"hidden",
  },
  loader:{
    position:"absolute",
    height:"100vh",
    width:"100vw",
    backgroundColor:"#00000055",
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  }
}

const mapStateToProps = (state) => {
  return {
    loadingSummary:state.loadingSummary,
    reload : state.reload,
    loading : state.loading,
    selected_media : state.selected_media,
    settingsWindowOpen : state.settingsWindowOpen,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
