import React, { Component } from 'react';
import { Card, Form, Typography, Input, Button, Row, Col, message } from 'antd';
const { Title } = Typography;

export default class Profile extends Component {
  state = {
    emailAddress: null,
    firstName: null,
    lastName: null,
    telephone: null,
    companyName: null,
    buttonLoading: false,
    saved: true,
  }

  // █░░ ░▀░ █▀▀ █▀▀ █▀▀ █░░█ █▀▀ █░░ █▀▀
  // █░░ ▀█▀ █▀▀ █▀▀ █░░ █▄▄█ █░░ █░░ █▀▀
  // ▀▀▀ ▀▀▀ ▀░░ ▀▀▀ ▀▀▀ ▄▄▄█ ▀▀▀ ▀▀▀ ▀▀▀
  
  async componentDidMount() {
    this.props.changeHeader('avatar', 'Wordlabs', [
      { url: '/account/profile', name: 'Profile' }
    ])
    await this.loadDataAndSetState();
    this.props.loadingComponent(false);
  }

  loadDataAndSetState = async () => {
    this.setState({saved: true});
    const user = await this.props.api.getUser(this.props.user.userKey);

    if(!user) {
      message.error('This user doesnt exist! log them out!');
      return;
    }
    
    const {
      emailAddress,
      firstName,
      lastName,
      telephone,
      companyName,
    } = user;

    this.setState({
      emailAddress,
      firstName,
      lastName,
      telephone,
      companyName,
    });
  }

  // █░░█ ▀▀█▀▀ ░▀░ █░░ ░▀░ ▀▀█▀▀ ░▀░ █▀▀ █▀▀
  // █░░█ ░░█░░ ▀█▀ █░░ ▀█▀ ░░█░░ ▀█▀ █▀▀ ▀▀█
  // ░▀▀▀ ░░▀░░ ▀▀▀ ▀▀▀ ▀▀▀ ░░▀░░ ▀▀▀ ▀▀▀ ▀▀▀

  convertEmptyStringToNull = string => {
    return (typeof string === 'string' && (string || '').length === 0) ? 'NULL' : string
  }
  
  signupValidation = () => {
    const {emailAddress, saved} = this.state;
    
    return (
      !saved &&
      emailAddress &&
      this.validateEmail(emailAddress)
    )
  }

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // █░░█ █▀▀█ █▀▀▄ █▀▀▄ █░░ █▀▀ █▀▀█ █▀▀
  // █▀▀█ █▄▄█ █░░█ █░░█ █░░ █▀▀ █▄▄▀ ▀▀█
  // ▀░░▀ ▀░░▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀▀▀ ▀░▀▀ ▀▀▀

  handleSubmitSignup = async () => {
    const {
      firstName,
      lastName,
      telephone,
      companyName
    } = this.state;

    let result = await this.props.api.updateUser(this.props.user.userKey, {
      firstName: this.convertEmptyStringToNull(firstName),
      lastName: this.convertEmptyStringToNull(lastName),
      telephone: this.convertEmptyStringToNull(telephone),
      companyName: this.convertEmptyStringToNull(companyName),
    });

    

    if(result.affectedRows > 0) {
      message.success('Your profile has been saved.')
    } else {
      message.error('Your profile couln\'t save with those details please try again.');
    }

    this.loadDataAndSetState();
  }

  handleCancel = () => {
    this.loadDataAndSetState();
  }

  handleForm = (key, value) => {
    this.setState({[key]: value, saved: false});
  }

  // █▀▀█ █▀▀ █▀▀▄ █▀▀▄ █▀▀ █▀▀█ █▀▀
  // █▄▄▀ █▀▀ █░░█ █░░█ █▀▀ █▄▄▀ ▀▀█
  // ▀░▀▀ ▀▀▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀░▀▀ ▀▀▀

  render() {
    return (
      <Row 
        gutter={16}
        style={{minHeight: '100%'}}
      >
        <Title 
          style={{paddingLeft: 8}}
          level={2}
        >
          Profile
        </Title>
        <Col span={12}>
          <Card bordered={false}>
            <Form
            // onKeyUp={e => this.handleEnterSubmit('signup', e)}
            >
              <Form.Item
                required
                label="Email"
                validateStatus={
                  this.validateEmail(this.state.emailAddress) ?
                  'success'
                  :
                  this.state.emailAddress &&
                  'error'
                }
                >
                <Input 
                  disabled
                  value={this.state.emailAddress}
                  onChange={e => this.handleForm('emailAddress', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="First Name">
                <Input value={this.state.firstName}
                  onChange={e => this.handleForm('firstName', e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Last Name">
                <Input value={this.state.lastName}
                  onChange={e => this.handleForm('lastName', e.target.value)}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
          <Card bordered={false}>
            <Form.Item label="Phone Number">
              <Input value={this.state.telephone}
                onChange={e => this.handleForm('telephone', e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Company">
              <Input value={this.state.companyName}
                onChange={e => this.handleForm('companyName', e.target.value)}
              />
            </Form.Item>
            {/* <Form.Item
              required
              label="Password"
              help="Passwords must be over 8 charactors long"
              validateStatus={
                (this.state.password || '').length > 8 ?
                  'success'
                  :
                  this.state.password &&
                  'error'
              }
            >
              <Input.Password value={this.state.password}
                onChange={e => this.handleForm('password', e.target.value)}
              />
            </Form.Item>
            <Form.Item
              required
              label="Confirm Password"
              help="The passwords must be the same"
              validateStatus={
                (this.state.passwordConfirm || '').length > 8 &&
                  this.state.passwordConfirm === this.state.password ?
                  'success'
                  :
                  this.state.passwordConfirm &&
                  'error'
              }
            >
              <Input.Password value={this.state.passwordConfirm}
                onChange={e => this.handleForm('passwordConfirm', e.target.value)}
              />
            </Form.Item> */}
            <Form.Item style={{ textAlign: 'right', marginTop: 70 }}>
              <Button
                type="primary"
                loading={this.state.buttonLoading}
                disabled={!this.signupValidation()}
                onClick={this.handleSubmitSignup}
              >Save</Button>
              <Button
                loading={this.state.buttonLoading}
                disabled={!this.signupValidation()}
                onClick={this.handleCancel}
              >Cancel</Button>
            </Form.Item>
          </Card>

        </Col>
      </Row>
    )
  }
}
