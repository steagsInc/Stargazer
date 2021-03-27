import React from 'react';
import { connect } from 'react-redux';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';
import Dropdown from 'react-bootstrap/Dropdown';

import replay10 from '../res/replay-10s.svg'
import forward10 from '../res/forward-10s.svg'
import play from '../res/play.svg'
import pause from '../res/pause.svg'
import volumeDown from '../res/volumeDown.svg'
import volumeUp from '../res/volumeUp.svg'
import subtitles from '../res/subtitles.svg'
import audioTrack from '../res/audioTrack.svg'

const {ReactMPV} = require("mpv.js");

class Player extends React.PureComponent {
  constructor(props) {
    super(props);
    this.mpv = null;
    this.state = {pause: true, "time-pos": 0,duration: 0,fullscreen:false,volume:100,refreshTracks:false,mouseMoving:false};
    this.tracks = {}
    this.timeout = null;
  }

  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyPress, false);
  }

  trackMedia(){
    var progression = this.state["time-pos"]/this.state.duration;
    if(this.state["time-pos"]/this.state.duration<0.9){
      if(this.props.selected_media.media.type==="movie"){
        window.tracker.addMovie(this.props.selected_media.key,progression)
      }else{
        window.tracker.addTv(this.props.selected_media.key,this.props.selected_media.media.season,this.props.selected_media.media.episode,progression)
      }
    }else{
      if(this.props.selected_media.media.type==="movie"){
        window.tracker.removeMedia(this.props.selected_media.key)
      }else{
        window.tracker.progressShow(this.props.selected_media.key,this.props.selected_media.media.season,this.props.selected_media.media.episode)
      }
    }
  }

  setMouseMove(e) {
    e.preventDefault();
    this.setState({mouseMoving: true});

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({mouseMoving:false}), 1000);
  }

  handleMPVReady(mpv) {
    this.mpv = mpv;
    this.mpv.observe("pause");
    this.mpv.observe("time-pos");
    this.mpv.observe("duration");
    this.mpv.observe("fullscreen");
    this.mpv.observe("volume");
    this.mpv.observe("track-list/count")
    this.mpv.command("loadfile", this.props.selected_media.media.path);
    this.mpv.property('sub-auto', 'fuzzy')
    this.mpv.property('hwdec', 'vaapi');
    //console.log(this.props.selected_media)
    setTimeout(() => this.mpv.property("time-pos",this.props.selected_media.progression*this.state.duration), 100);
  }
  handlePropertyChange(name, value) {
    if (name === "time-pos" && this.seeking) return;
    if (name.includes("track-list")) return this.trackSorting(name, value);
    this.setState({[name]: value});
  }

  trackSorting(name, value){
    if(name!=='track-list/count'){
      let index = name.charAt(11)
      let property = name.slice(13)
      if (this.tracks[index]===undefined) this.tracks[index]={};
      this.tracks[index][property] = value
    }
    else{
      this.trackCount = value;
      for (let i = 0; i < value; i++) {
        this.mpv.observe("track-list/"+i+"/id")
        this.mpv.observe("track-list/"+i+"/type")
        this.mpv.observe("track-list/"+i+"/lang")
        this.mpv.observe("track-list/"+i+"/selected")
      }
    }
    this.setState({refreshTracks: !this.state.refreshTracks});
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
          this.exit()
        break;
      case ' ':
          this.togglePause();
        break;
      case 'ArrowLeft':
          this.replay10()
        break;
      case 'ArrowRight':
          this.forward10()
        break;
      default:

    }
  }

  exit(){
    this.trackMedia()
    this.props.dispatch({ type: 'SET_SELECTED', value:null})
  }

  forward10(){
    this.mpv.property("time-pos", this.state["time-pos"]+10);
    this.setState({"time-pos": this.state["time-pos"]+10});
  }

  replay10(){
    this.mpv.property("time-pos", this.state["time-pos"]-10);
    this.setState({"time-pos": this.state["time-pos"]-10});
  }

  handleSeekMouseDown = () => {
    this.seeking = true;
  }

  handleSeekMouseUp = () => {
    this.seeking = false;
  }

  handleSlideTime = (event, newValue) => {
    this.setState({"time-pos": newValue});
    this.mpv.property("time-pos", newValue);
  }

  handleSlideVolume = (event, newValue) => {
    this.setState({"volume": newValue});
    this.mpv.property("volume", newValue);
  }

  _volumeControl(){
    return (
      <div style={styles.subsection}>
        <img style={styles.volumeIcon} src={volumeDown} alt=''/>
        <PlayerSlider
         style={styles.progress}
         min={0}
         step={0.1}
         max={this.state.value}
         value={this.state["volume"]}
         onChange={this.handleSlideVolume}
         onMouseDown={this.handleSeekMouseDown}
         onChangeCommitted={this.handleSeekMouseUp}
        />
        <img style={styles.volumeIcon} src={volumeUp} alt=''/>
      </div>
    )
  }

  _runControl(){
    return(
      <div style={styles.subsection}>
      <img style={styles.controlbis} src={replay10} alt=''
      onClick={() => this.replay10()}/>
      <img style={styles.control} src={this.state.pause ? play : pause} alt=''
      onClick={this.togglePause}/>
      <img style={styles.controlbis} src={forward10} alt=''
      onClick={() => this.forward10()}/>
      </div>
    )
  }

  subControl = () => {
    let items = window.data.addSubtitles()
    if (items) {
      this.mpv.command("sub-add", items[0]);
    }
  }

  CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {

    return (
      <div
        ref={ref}
        style={{...style,...styles.dropUp}}
        className={className}
      >
        {React.Children.toArray(children)}
      </div>
    );
  },
);

  CustomItem = React.forwardRef(({ children, onClick }, ref) => (
    <p ref={ref} style={styles.dropItem}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}>{children}</p>
  ));

  CustomToggle = React.forwardRef(({ children, onClick, src }, ref) => (
    <img
      style={styles.subIcon} alt='' src={src} ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    />
  ));

  select(type,key){
    console.log(type,key)
    this.mpv.property(type,key)
  }

  _TrackControl(){
    var audio = []
    var sub = []
    for (let [key, value] of Object.entries(this.tracks)){
      if(value.type==="audio"){
        audio.push(<Dropdown.Item as={this.CustomItem} key={key} onClick={() => this.select("aid",value.id)}>{value.id+" - "+value.lang}</Dropdown.Item>)
      }
      if(value.type==="sub"){
        sub.push(<Dropdown.Item as={this.CustomItem} key={key} onClick={() => this.select("sid",key)}>{value.id+" - "+value.lang}</Dropdown.Item>)
      }
    }
    return(
      <div style={styles.subsection}>
      <Dropdown drop='up'>
        <Dropdown.Toggle src={audioTrack} as={this.CustomToggle}/>
        <Dropdown.Menu as={this.CustomMenu}>
        {audio}
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown drop='up'>
        <Dropdown.Toggle src={subtitles} as={this.CustomToggle}/>
        <Dropdown.Menu as={this.CustomMenu}>
        {sub}
        </Dropdown.Menu>
      </Dropdown>
      </div>
    )
  }

  render() {
    let toolbarStyle = (this.state.mouseMoving ? styles.ToolBar : {display:"none"})
    return (
      <div styles={{height:"100vh",width:"100vw"}}
        onMouseMove={e => this.setMouseMove(e)}>
        <ReactMPV
          style={{position: 'absolute',height: "100%",width: "100%"}}
          className="player"
          onReady={this.handleMPVReady.bind(this)}
          onPropertyChange={this.handlePropertyChange.bind(this)}
          onMouseDown={this.togglePause}
        />
        <div style={styles.Exit} onClick={() => this.exit()}>
          <p style={{fontSize: 16,textAlign: "center"}}>
          X
          </p>
        </div>
        <div style={toolbarStyle}>
          <div style={styles.inlinetop}>
            {this._volumeControl()}
            {this._runControl()}
            {this._TrackControl()}
          </div>
          <div style={styles.inlinebot}>
            <p style={{fontSize: 15}}>
            {Math.floor(this.state["time-pos"]/3600)+":"+Math.floor((this.state["time-pos"]/60)%60)+":"+Math.floor(this.state["time-pos"]%60)}
            </p>
            <PlayerSlider
            style={styles.progress}
             min={0}
             step={0.1}
             max={this.state.duration}
             value={this.state["time-pos"]}
             onChange={this.handleSlideTime}
             onMouseDown={this.handleSeekMouseDown}
             onChangeCommitted={this.handleSeekMouseUp}
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  Exit:{
    position:"absolute",
    width:"5%",
    height:"5%",
    backgroundColor:'#000000aa',
    borderBottom:"solid",
    borderRight:"solid",
    borderWidth:2,
    borderBottomRightRadius:10,
    borderColor:"#111111",
    alignItems:"center",
    justifyContent:"center",
  },
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
    width:"80%",
  },
  control : {
    height:"75%",
    width:"100%",
  },
  controlbis : {
    height:"65%",
    width:"100%",
  },
  volumeIcon : {
    height:"30%",
    width:"30%",
  },
  subIcon : {
    height:"50%",
    width:"50%",
  },
  subsection : {
    height:"100%",
    width:"33%",
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center"
  },
  inlinetop : {
    height:"50%",
    width:"90%",
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center"
  },
  inlinebot : {
    height:"50%",
    width:"100%",
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center"
  },
  dropUp:{
    backgroundColor:"#000000aa",
    border:"solid",
    borderRadius:"10%",
    borderColor:"white",
    borderWidth:1,
    paddingLeft:"5%",
    paddingRight:"5%",
  },
  dropItem:{
    fontSize:15,
    color:"white",
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
