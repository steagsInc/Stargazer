import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Store from '../../store/configureStore'
const {ReactMPV} = require("mpv.js");

class Player extends React.PureComponent {
  constructor(props) {
    super(props);
    this.mpv = null;
    this.state = {pause: true, "time-pos": 0,duration: 0,fullscreen:false};
  }

  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyPress, false);
  }

  handleMPVReady(mpv) {
    this.mpv = mpv;
    this.mpv.observe("pause");
    this.mpv.observe("time-pos");
    this.mpv.observe("duration");
    this.mpv.observe("fullscreen");
    this.mpv.command("loadfile", this.props.selected_media);
  }
  handlePropertyChange(name, value) {
    if (name === "time-pos" && this.seeking) return;
    this.setState({[name]: value});
  }

  togglePause = () => {
    this.mpv.property("pause", !this.state.pause);
  }

  handleKeyPress = (event) => {
    console.log(event.key)
    switch (event.key) {
      case 'f':
          this.mpv.property("fullscreen", !this.state.fullscreen);
          window.electron.window.setFullScreen(!this.state.fullscreen);
        break;
      case 'Escape':
          Store.dispatch({ type: 'SET_SELECTED', value:null})
        break;
      case ' ':
          this.togglePause();
        break;
      case 'ArrowLeft':
          this.mpv.property("time-pos", this.state["time-pos"]-10);
          this.setState({"time-pos": this.state["time-pos"]-10});
        break;
      case 'ArrowRight':
          this.mpv.property("time-pos", this.state["time-pos"]+10);
          this.setState({"time-pos": this.state["time-pos"]+10});
        break;
      default:

    }
  }

  handleSeekMouseDown = () => {
    this.seeking = true;
  }

  handleSlide = (event, newValue) => {
    this.setState({"time-pos": newValue});
    this.mpv.property("time-pos", newValue);
  }

  handleSeekMouseUp = () => {
    this.seeking = false;
  }

  render() {
    return (
      <div>
        <ReactMPV
          style={{position: 'absolute',height: "100%",width: "100%"}}
          className="player"
          onReady={this.handleMPVReady.bind(this)}
          onPropertyChange={this.handlePropertyChange.bind(this)}
          onMouseDown={this.togglePause}
        />
        <div style={styles.ToolBar}>
          <button style={styles.control} onClick={this.togglePause}>
            {this.state.pause ? "▶" : "❚❚"}
          </button>
          <PlayerSlider
          style={styles.progress}
           min={0}
           step={0.1}
           max={this.state.duration}
           value={this.state["time-pos"]}
           onChange={this.handleSlide}
           onMouseDown={this.handleSeekMouseDown}
           onChangeCommitted={this.handleSeekMouseUp}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  ToolBar : {
    position:"absolute",
    width:"30%",
    height:"10%",
    left:"35%",
    right:"35%",
    bottom:"20%",
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"space-around",
    backgroundColor:'#000000aa',
    border:"solid",
    borderWidth:2,
    borderRadius:10,
    borderColor:"#111111"
  },
  progress : {
    width:"90%",
  },
  control : {
    width:50,
    height:40,
    fontSize: 23,
    border: "none",
    outline: "none",
    cursor: "pointer",
    color:"white",
    backgroundColor:'#00000000',
    marginRight: 5,
  }
}

const PlayerSlider = withStyles({
  root: {
    color: '#220055ff',
    height: 3,
  },
  thumb: {
    backgroundColor: '#fff',
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  track: {
    height: 3,
    borderRadius: 4,
    backgroundColor: '#fc6f03',
  },
  rail: {
    height: 3,
    borderRadius: 4,
  },
})(Slider);

const mapStateToProps = (state) => {
  return {
    selected_media : state.selected_media,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
