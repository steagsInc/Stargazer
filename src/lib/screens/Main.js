import React from 'react';
import { connect } from 'react-redux'
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';
import Store from '../../store/configureStore'
import SettingsWindow from "../components/SettingsWindow.js"
import MediaLibrary from "../components/MediaLibrary.js"
import Summary from "../components/Summary.js"

class Main extends React.Component {

  _player(src){
    console.log(src)
    return (
      <Video autoPlay loop muted
            controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
            onCanPlayThrough={() => {
                // Do stuff
            }}>
            <source src={src} />
        </Video>
    )
  }

  render(){
  if(this.props.player!=null) return this._player(this.props.player);
  return (
    <div className="MainWindow">
      <Summary/>
      <MediaLibrary/>
      <SettingsWindow/>
    </div>
  );
}
}

const mapStateToProps = (state) => {
  return {
    player: state.player,
    reload : state.reload
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
