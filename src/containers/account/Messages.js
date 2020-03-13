import React, { Component } from "react";

export default class Messages extends Component {
  componentDidMount() {
    this.props.loadingComponent(false);
  }
  render() {
    return (
      <div>Messages</div>
    )
  }
}