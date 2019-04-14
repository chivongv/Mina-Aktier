import React, { Component } from "react";

class ToggleMode extends Component {
  fadeTransition = () => {
    document.documentElement.classList.add("transition");
    window.setTimeout(() => {
      document.documentElement.classList.remove("transition");
    }, 1500);
  };

  handleClick(event) {
    this.props.toggleUIMode();
  }

  handleChange() {
    this.fadeTransition();
    if (this.props.checked) {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }

  render() {
    return (
      <div className="toggle-container">
        <input
          type="checkbox"
          id="switch"
          name="theme"
          checked={this.props.checked}
          onChange={() => this.handleChange()}
          onClick={() => this.handleClick()}
        />
      </div>
    );
  }
}

export default ToggleMode;
