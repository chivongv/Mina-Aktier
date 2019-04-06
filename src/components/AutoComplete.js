import React, { Component } from 'react';

class AutoComplete extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: [],
      value: ''
    }
  }

  componentDidMount(){
    this.setState({
      items: this.props.items
    })
  }

  handleChange(event){
    const value = event.target.value;
  }

  render() {
    return (
      <input type="text" placeholder={this.props.placeholder}/>
    );
  }
}

export default AutoComplete;
