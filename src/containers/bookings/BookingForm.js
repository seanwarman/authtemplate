import React, { Component } from 'react';
import {Typography, message} from 'antd';
import JsonFormFill from '../../components/json/JsonFormFill';
import JsonFormBuilder from '@seanwarman/json-form-builder';

const {Text} = Typography;

const jsonFormSanitiser = JsonFormBuilder('jsonFormSanitiser');
const sanitiseString = JsonFormBuilder('sanitiseString');

// █▀▄▀█ █▀▀█ ░▀░ █▀▀▄ ░░░ █▀▀ █▀▀█ █▀▄▀█ █▀▀█ █▀▀█ █▀▀▄ █▀▀ █▀▀▄ ▀▀█▀▀
// █░▀░█ █▄▄█ ▀█▀ █░░█ ▀▀▀ █░░ █░░█ █░▀░█ █░░█ █░░█ █░░█ █▀▀ █░░█ ░░█░░
// ▀░░░▀ ▀░░▀ ▀▀▀ ▀░░▀ ░░░ ▀▀▀ ▀▀▀▀ ▀░░░▀ █▀▀▀ ▀▀▀▀ ▀░░▀ ▀▀▀ ▀░░▀ ░░▀░░

export default class BookingForm extends Component {

  state = {
    template: null,
    contentType: null,
    wordCount: null,
    saveToStatus: 'Live',
  }
  
  // █░░ ░▀░ █▀▀ █▀▀ █▀▀ █░░█ █▀▀ █░░ █▀▀
  // █░░ ▀█▀ █▀▀ █▀▀ █░░ █▄▄█ █░░ █░░ █▀▀
  // ▀▀▀ ▀▀▀ ▀░░ ▀▀▀ ▀▀▀ ▄▄▄█ ▀▀▀ ▀▀▀ ▀▀▀

  async componentDidMount() {
    this.props.changeHeader('file-add', 'Wordlabs', [
      {url: '/booking/new', name: 'New'},
      {url: '/booking/form/' + this.props.match.params.contentType + '/' + this.props.match.params.wordCount, name: 'Booking Form'},
    ]);
    await this.loadDataAndSetState();
    this.props.loadingComponent(false);
  }

  loadDataAndSetState = async() => {
    this.props.loadingComponent(true);

    let stateCopy = { ...this.state };

    let template = await this.props.api.getBookingTemplate(this.props.tmpKey);
    if(template) {
      stateCopy.template = template;
    }

    stateCopy.contentType = this.props.match.params.contentType;
    stateCopy.wordCount = this.props.match.params.wordCount;

    this.setState(stateCopy);
  }

  // █░░█ ▀▀█▀▀ ░▀░ █░░ ░▀░ ▀▀█▀▀ ░▀░ █▀▀ █▀▀
  // █░░█ ░░█░░ ▀█▀ █░░ ▀█▀ ░░█░░ ▀█▀ █▀▀ ▀▀█
  // ░▀▀▀ ░░▀░░ ▀▀▀ ▀▀▀ ▀▀▀ ░░▀░░ ▀▀▀ ▀▀▀ ▀▀▀

  populateAutoFields = (jsonForm) => {
    const wordCount = this.state.wordCount;
    const contentType = this.state.contentType;
    const units = wordCount / 100;

    return jsonForm.reduce((arr,item) => (
      item.label === 'Word Count' ?
      [...arr, {...item, value: wordCount}]
      :
      item.label === 'Content Type' ?
      [...arr, {...item, value: contentType}]
      :
      item.label === 'Units' ?
      [...arr, {...item, value: units}]
      :
      arr
    ),[]);
  }

  selectStatus = (jsonStatus, status) => (
    jsonStatus.map(statusItem => (
      statusItem.value === status ?
      {...statusItem, selected: true}
      :
      statusItem
    ))
  )
  
  // █░░█ █▀▀█ █▀▀▄ █▀▀▄ █░░ █▀▀ █▀▀█ █▀▀
  // █▀▀█ █▄▄█ █░░█ █░░█ █░░ █▀▀ █▄▄▀ ▀▀█
  // ▀░░▀ ▀░░▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀▀▀ ▀░▀▀ ▀▀▀

  handleCreateBooking = async jsonFormState => {
    const {bookingDivision, user} = this.props;
    const {saveToStatus} = this.state;

    const jsonStatus = this.selectStatus(bookingDivision.jsonStatus, saveToStatus);
    const jsonForm = this.populateAutoFields(jsonFormState.jsonForm);
    
    const body = {
      bookingName: sanitiseString(jsonFormState.customFields.find(item => item.label === 'Booking Name').value),
      jsonForm: jsonFormSanitiser(jsonForm),
      tmpKey: this.props.tmpKey,
      assignedPartnerKey: this.props.user.partnerKey,
      createdPartnerKey: this.props.user.partnerKey,
      bookingDivKey: this.props.user.bookingDivKey,
      createdUserKey: user.userKey,
      currentStatus: saveToStatus,
      jsonStatus: JSON.stringify(jsonStatus),
      units: this.state.wordCount / 10,
      colorLabel: this.state.template.colorLabel,
    }

    const result = await this.props.api.createBooking(body);

    if(result.affectedRows > 0) {
      message.success('Your booking has been saved to our system! Check out it\'s progress...', 5);
      this.props.history.push('/booking/' + saveToStatus.toLowerCase());
      return;
    } else {
      message.error('Your booking didn\'t save, please try again.');
    }

    // await this.loadDataAndSetState()
    // return;
  }

  handleCustomerSelection = customerKey => {
    this.setState({customerKey});
  }

  handleCreateNewCustomer = async customerName => {
    let customerKey = await this.props.api.createBMSCustomer({
      customerName: customerName,
      partnerKey: this.props.user.partnerKey,
      userKey: this.props.user.userKey
    });
    this.setState({customerKey});
    return {affectedRows: 1};
  }
  
  // █▀▀█ █▀▀ █▀▀▄ █▀▀▄ █▀▀ █▀▀█ █▀▀
  // █▄▄▀ █▀▀ █░░█ █░░█ █▀▀ █▄▄▀ ▀▀█
  // ▀░▀▀ ▀▀▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀░▀▀ ▀▀▀ 

  render() {
    return (
      this.state.template &&
      <div
        style={{padding: '16px 20% 0 20%'}}
      >
        <div>
          <h1>{this.state.contentType}</h1>
        </div>
        <Text type="secondary">
          Fill in the required fields to send your booking through to the Bigg team.
        </Text>
        <div style={{marginTop: 16}}>
          <JsonFormFill
            omitFieldsByLabel={[
              'Units',
              'Word Count',
              'Content Type'
            ]}
            extraValidationValues={[
              // {
              //   value: this.state.customerKey,
              //   required: true
              // }
            ]}
            customFields={[
              {
                type: 'input',
                label: 'Booking Name',
                required: true
              }
            ]}
            jsonForm={this.state.template.jsonForm}
            update={this.handleCreateBooking}
          />
        </div>
      </div>
    )
  }
}