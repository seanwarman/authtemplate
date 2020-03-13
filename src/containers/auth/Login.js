import React, { Component } from 'react';
import { Input, Typography, Form, Button, message, Card, Icon } from 'antd';
import {API} from 'aws-amplify';

const {Title} = Typography;

class LinkButton extends Component {
  render = () => (
    <Button
      style={{ padding: 0 }}
      type="link"
      onClick={() => this.props.handler(this.props.view)}
    >{this.props.text}</Button>
  )
}

export default class Login extends Component {
  state = {
    emailAddress: null,
    password: null,
    passwordConfirm: null,
    firstName: null,
    lastName: null,
    telephone: null,
    companyName: null,
    
    view: 'login',
    buttonLoading: false,
  }

  // █░░ ░▀░ █▀▀ █▀▀ █▀▀ █░░█ █▀▀ █░░ █▀▀
  // █░░ ▀█▀ █▀▀ █▀▀ █░░ █▄▄█ █░░ █░░ █▀▀
  // ▀▀▀ ▀▀▀ ▀░░ ▀▀▀ ▀▀▀ ▄▄▄█ ▀▀▀ ▀▀▀ ▀▀▀

  componentDidMount() {
    this.loadDataAndSetState();
  }

  loadDataAndSetState = (stateCopy) => {
    if(!stateCopy) stateCopy = { ...this.state };
    stateCopy.emailAddress = null;
    stateCopy.password = null;
    stateCopy.passwordConfirm = null;
    stateCopy.firstName = null;
    stateCopy.lastName = null;
    stateCopy.telephone = null;
    stateCopy.companyName = null;
    this.setState(stateCopy);
  }

  // ▀█░█▀ █▀▀█ █░░ ░▀░ █▀▀▄ █▀▀█ ▀▀█▀▀ ░▀░ █▀▀█ █▀▀▄
  // ░█▄█░ █▄▄█ █░░ ▀█▀ █░░█ █▄▄█ ░░█░░ ▀█▀ █░░█ █░░█
  // ░░▀░░ ▀░░▀ ▀▀▀ ▀▀▀ ▀▀▀░ ▀░░▀ ░░▀░░ ▀▀▀ ▀▀▀▀ ▀░░▀

  signupValidation = () => {
    const {emailAddress, password, passwordConfirm} = this.state;
    
    return (
      emailAddress &&
      password &&
      passwordConfirm &&
      password === passwordConfirm &&
      this.validateEmail(emailAddress)
    )
  }

  loginValidation = () => {
    const {emailAddress, password} = this.state;
    
    return (
      emailAddress &&
      password
    )
  }

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // █░░█ █▀▀█ █▀▀▄ █▀▀▄ █░░ █▀▀ █▀▀█ █▀▀
  // █▀▀█ █▄▄█ █░░█ █░░█ █░░ █▀▀ █▄▄▀ ▀▀█
  // ▀░░▀ ▀░░▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀▀▀ ▀░▀▀ ▀▀▀

  handleForm = (field, value) => {
    let stateCopy = { ...this.state };
    stateCopy[field] = value;
    this.setState(stateCopy);
  }

  handleInput = e => {
    let stateCopy = { ...this.state };
    stateCopy.form.password = e.target.value;
    this.setState(stateCopy);
  }

  handleEnterSubmit = (formType, e) => {
    if(e.keyCode === 13 || e.which === 13) {
      if(formType === 'login') {
        if(!this.loginValidation()) return;
        this.handleSubmitLogin()
      } 
      if(formType === 'signup') {
        if(!this.signupValidation()) return;
        this.handleSubmitSignup()
      } 
      if(formType === 'password') {
        if(!this.validateEmail(this.state.emailAddress)) return;
        this.handleSendConfirmation()
      } 
    }
  }

  handleSubmitLogin = async() => {
    this.setState({buttonLoading: true})
    let stateCopy = { ...this.state };
    const emailAddress = stateCopy.emailAddress;
    let password = stateCopy.password;
    const result = await this.props.api.auth({
      emailAddress,
      password
    });

    stateCopy.buttonLoading = false;

    if(!result) {
      message.error('Your email or password are in-correct. Please try again.');
      stateCopy.password = '';
      this.setState(stateCopy);
      return;
    } else {
      message.success('Hi there!');
      this.props.authenticated(result.key, emailAddress);
      return;
    } 
  }

  handleSubmitSignup = async() => {
    this.setState({buttonLoading: true});
    let stateCopy = { ...this.state };
  
    const {
      emailAddress,
      password,
      firstName,
      lastName,
      telephone,
      companyName,
    } = this.state;

    let result = await this.props.api.createUser({
      emailAddress,
      password,
      firstName,
      lastName,
      telephone,
      companyName,
    });

    stateCopy.buttonLoading = false;

    if(!result) {
      message.error('We where unable to create an account with this user data, please try again.');
      stateCopy.view = 'signup';
      this.loadDataAndSetState(stateCopy); 
    } else if(result.message === 'Inuse') {
      message.error(
        'This email is already being used, are you sure you don\'t already have an account?'
      );
    } else {
      message.success('Your Wordlabs account has been created please login to start using it!');
      stateCopy.view = 'login';
      this.loadDataAndSetState(stateCopy);
    }
  }

  handleView = (view) => {
    this.setState({view});
  }

  handleSendConfirmation = async () => {
    this.setState({buttonLoading: true});
    console.log('confirming...');
    const result = await this.props.api.notify({
      emailAddress: this.state.emailAddress,
      resetLink: this.props.origin + '/reset'
    });
    if(result.affectedRows === 0) {
      message.warn('There\'s no user in our system with this email please check the email and try again.');
      this.loadDataAndSetState();
      return;
    }
    let stateCopy = { ...this.state };
    stateCopy.view = 'sent';
    stateCopy.buttonLoading = false;
    this.loadDataAndSetState(stateCopy);
  }

  // █▀▀█ █▀▀ █▀▀▄ █▀▀▄ █▀▀ █▀▀█ █▀▀
  // █▄▄▀ █▀▀ █░░█ █░░█ █▀▀ █▄▄▀ ▀▀█
  // ▀░▀▀ ▀▀▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀░▀▀ ▀▀▀

  sent = () => (
    <Card style={{ 
      width: 400,
      margin: 'auto',
      height: 400,
      display: 'flex', 
      alignItems: 'center'
    }}>
      <div
        style={{textAlign: 'center'}}
        level={4}
      >
        <Icon style={{fontSize: 56, marginBottom: 20}} type="mail" /> <br />
        <Title level={4}>
          Ok that's sent!
        </Title>
        <p>
          Give it a minute, check your email and follow the link to reset your password.
        </p>
      </div>
    </Card>
  )

  password = () => (
    <Card style={{ 
      width: 400,
      margin: 'auto',
    }}>
      <Title level={2}>Forgotten Password</Title>
      <div>Enter your email address and we'll send you a confirmation to reset your password.</div>
      <Form
        onKeyUp={e => this.handleEnterSubmit('password', e)}
      >
        <Form.Item label="Email">
          <Input 
            value={this.state.emailAddress} 
            onChange={e => this.handleForm('emailAddress', e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <LinkButton
            text="Back to login"
            handler={this.handleView}
            view="login"
          />
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'right' }}>
        <Button
          loading={this.state.buttonLoading}
          disabled={!this.validateEmail(this.state.emailAddress)}
          type="primary"
          onClick={this.handleSendConfirmation}
        >Send Confirmation</Button>
      </div>
    </Card>
  )

  signup = () => (
    <Card style={{ 
      width: 800 ,
      margin: 'auto',
    }}>
      <Title level={2}>Signup</Title>
      <Form
        onKeyUp={e => this.handleEnterSubmit('signup', e)}
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
          <Input value={this.state.emailAddress} 
            onChange={e => this.handleForm('emailAddress', e.target.value)}
          />
        </Form.Item>
        {/* <Form.Item label="First Name">
          <Input value={this.state.firstName} 
            onChange={e => this.handleForm('firstName', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input value={this.state.lastName} 
            onChange={e => this.handleForm('lastName', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Phone Number">
          <Input value={this.state.telephone} 
            onChange={e => this.handleForm('telephone', e.target.value)}
          /> 
        </Form.Item> 
        <Form.Item label="Company">
          <Input value={this.state.companyName} 
            onChange={e => this.handleForm('companyName', e.target.value)}
          />
        </Form.Item> */}
        <Form.Item 
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
        </Form.Item>
        <Form.Item>
          <LinkButton
            text="Back to login"
            handler={this.handleView}
            view="login"
          />
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'right' }}>
        <Button
          loading={this.state.buttonLoading}
          disabled={!this.signupValidation()}
          type="primary"
          onClick={this.handleSubmitSignup}
        >Sign Up</Button>
      </div>
    </Card>
  )
  
  login = () => (
    <Card style={{ 
      width: 400,
      margin: 'auto',
    }}>
      <Title level={2}>Login</Title>
      <Form
        onKeyUp={e => this.handleEnterSubmit('login', e)}
      >
        <Form.Item label="Email">
          <Input 
            value={this.state.emailAddress} 
            onChange={e => this.handleForm('emailAddress', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Password">
          <Input.Password 
            value={this.state.password} 
            onChange={e => this.handleForm('password', e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <div>
            <LinkButton
              text="Create an account"
              handler={this.handleView}
              view="signup"
            />
          </div>
          <div>
            <LinkButton
              text="Forgot password?"
              handler={this.handleView}
              view="password"
            />
          </div>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'right' }}>
        <Button
          loading={this.state.buttonLoading}
          disabled={!this.loginValidation()}
          type="primary"
          onClick={this.handleSubmitLogin}
        >Login</Button>
      </div>
    </Card>
  )
  
  render() {
    const {view} = this.state;
    return (
      this[view]()
    )
  }
}
