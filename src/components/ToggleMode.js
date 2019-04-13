import React, { Component } from 'react';

class ToggleMode extends Component {

  state = {
    checked: false
  }
  
  fadeTransition = () => {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
      document.documentElement.classList.remove('transition');
    }, 750)
  }

  handleClick(){
    this.fadeTransition()
    if(!this.state.checked){
      document.documentElement.setAttribute('data-theme','dark')
      localStorage.setItem('toggle-theme', 'dark');
      this.setState({
        checked: true
      })
    }else{
      document.documentElement.setAttribute('data-theme','light')
      localStorage.setItem('toggle-theme', 'light');
      this.setState({
        checked: false
      })
    }
  }

  handleChange() {
    if(localStorage.getItem('toggle-theme') === "light"){
      this.setState({
        checked: false
      })
      document.documentElement.setAttribute('data-theme','light')
    }else{
      this.setState({
        checked: true
      })
      document.documentElement.setAttribute('data-theme','dark')
    }
  }

  render() {
    return (
      <div className="toggle-container">
        <input type="checkbox" id="switch" name="theme" checked={this.state.checked} onChange={() => this.handleChange()} onClick={() => this.handleClick()}/>
      </div>
    );
  }
}

export default ToggleMode;
