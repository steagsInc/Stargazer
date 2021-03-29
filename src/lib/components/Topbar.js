import React from 'react';
import { connect } from 'react-redux'

class Topbar extends React.Component {

  onClick(action){
    if(action==="min"){
      window.electron.window.minimize();
    }else if(action==="max"){
      window.electron.window.maximize();
    }else if(action==="close"){
      window.electron.window.close();
    }
  }

  render(){
    if(this.props.fullscreen) return null;
    return (
      <div id="title-bar">
          <div style={styles.title}>Stargazer</div>
          <div style={styles.buttons} id="title-bar-buttons">
               <button style={styles.button} onClick={() => this.onClick("min")}>-</button>
               <button style={styles.button} onClick={() => this.onClick("max")}>+</button>
               <button style={styles.button} onClick={() => this.onClick("close")}>x</button>
          </div>
     </div>
  );
}
}

const styles = {
  title:{
    marginLeft:"10px"
  },
  buttons:{
    marginRight:"10px"
  },
  button : {
    fontSize:20,
    height:"100%",
    backgroundColor:"#00000088",
    border: 0,
    color:"white",
    outline: "none"
  }
}

const mapStateToProps = (state) => {
  return {
    fullscreen: state.fullscreen
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
