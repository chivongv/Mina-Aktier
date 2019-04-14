import React, { Component } from 'react';

class ToggleMode extends Component {

  state = {
    checked: false
  }

  fadeTransition = () => {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
      document.documentElement.classList.remove('transition');
    }, 1500)
  }

  handleClick(){
    this.fadeTransition()
    if(!this.state.checked){
      document.documentElement.setAttribute('data-theme','dark')
      localStorage.setItem('mina-aktier-theme', 'dark');
      this.setState({
        checked: true
      })
    }else{
      document.documentElement.setAttribute('data-theme','light')
      localStorage.setItem('mina-aktier-theme', 'light');
      this.setState({
        checked: false
      })
    }
  }

  handleChange() {
    if(localStorage.getItem('mina-aktier-theme') === "light"){
      document.documentElement.setAttribute('data-theme','light')
      this.setState({
        checked: false
      })
    }else{
      document.documentElement.setAttribute('data-theme','dark')
      this.setState({
        checked: true
      })
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
