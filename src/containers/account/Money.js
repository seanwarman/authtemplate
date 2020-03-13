import React, { Component } from "react";

export default class Money extends Component {
  componentDidMount() {
    this.props.loadingComponent(false);
  }
  render() {
    return (
      <div>Money</div>
    )
  }
}