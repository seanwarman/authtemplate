import React, { Component } from "react";

export default class Dashboard extends Component {
  componentDidMount() {
    this.props.changeHeader('dashboard', 'Wordlabs', [{url: '/dashboard', name: 'Dashboard'}])
  }
  render() {
    return (
      <div>Dashboard</div>
    )
  }
}