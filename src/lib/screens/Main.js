import React from 'react';
import { connect } from 'react-redux'
import SettingsWindow from "../components/SettingsWindow.js"
import MediaLibrary from "../components/MediaLibrary.js"
import Summary from "../components/Summary.js"

class Main extends React.Component {

  render(){
  return (
    <div className="MainWindow">
      <Summary data={this.props.loadingSummary} />
      <MediaLibrary/>
      <SettingsWindow/>
    </div>
  );
}
}

const mapStateToProps = (state) => {
  return {
    loadingSummary:state.loadingSummary,
    reload : state.reload
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
