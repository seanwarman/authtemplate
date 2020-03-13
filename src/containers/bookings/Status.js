import React, { Component } from 'react';
import {Table} from 'antd';
import moment from 'moment';
import picker from '../../libs/biggStatusColorPicker';

export default class Status extends Component {

  componentDidMount() {
    const status = this.props.match.params.status;
    this.props.changeHeader(picker('status', 'value', this.props.getStatusString(status)).icon, 'Wordlabs', [
      {url: '/booking/' + status, name: this.props.getStatusString(status)}
    ]);
    this.props.loadingComponent(false);
  }
  
  render() {
    return (
      <Table 
        columns={[
          {
            title: 'Booking Name',
            dataIndex: 'bookingName',
            key: 'bookingName',
          },
          {
            title: 'created',
            dataIndex: 'created',
            key: 'created',
            render: dateString => (
              moment(dateString).format('ll')
            )
          },
        ]}      
        rowKey="bookingsKey"
        dataSource={this.props.getBookingsByStatus(this.props.match.params.status)}
      />
    )
  }
}