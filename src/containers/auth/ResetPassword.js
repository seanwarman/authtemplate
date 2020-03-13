import React, { Component } from 'react';
import { Input, Typography, Form, Button, message, Card } from 'antd';
import {API} from 'aws-amplify';

const {Title} = Typography;

export default class ResetPassword extends Component {

  state = {
    password: null,
    passwordConfirm: null,
    emailAddress: null,
  }

  // █░░ ░▀░ █▀▀ █▀▀ █▀▀ █░░█ █▀▀ █░░ █▀▀
  // █░░ ▀█▀ █▀▀ █▀▀ █░░ █▄▄█ █░░ █░░ █▀▀
  // ▀▀▀ ▀▀▀ ▀░░ ▀▀▀ ▀▀▀ ▄▄▄█ ▀▀▀ ▀▀▀ ▀▀▀

  componentDidMount() {
    // Check the link's uuid matches passwordReset in a user record. Also get the user's emailAddress.
    
  }
  
  // █▀▀█ █▀▀█ ░▀░
  // █▄▄█ █░░█ ▀█▀
  // ▀░░▀ █▀▀▀ ▀▀▀

  reset = async body => {
    try {
      return await API.put('biggly', `/wordlabs/reset`, {
        body
      });
    } catch (error) {
      console.log('There was an error restting the password: ', error);
      return null;
    }
  }

  // ▀█░█▀ █▀▀█ █░░ ░▀░ █▀▀▄ █▀▀█ ▀▀█▀▀ ░▀░ █▀▀█ █▀▀▄
  // ░█▄█░ █▄▄█ █░░ ▀█▀ █░░█ █▄▄█ ░░█░░ ▀█▀ █░░█ █░░█
  // ░░▀░░ ▀░░▀ ▀▀▀ ▀▀▀ ▀▀▀░ ▀░░▀ ░░▀░░ ▀▀▀ ▀▀▀▀ ▀░░▀
  
  passwordValidation = () => {
    const {password, passwordConfirm} = this.state;
    return (
      password &&
      passwordConfirm &&
      password === passwordConfirm
    )
  }

  // █░░█ █▀▀█ █▀▀▄ █▀▀▄ █░░ █▀▀ █▀▀█ █▀▀
  // █▀▀█ █▄▄█ █░░█ █░░█ █░░ █▀▀ █▄▄▀ ▀▀█
  // ▀░░▀ ▀░░▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀▀▀ ▀░▀▀ ▀▀▀

  handleForm = (field, value) => {
    let stateCopy = { ...this.state };
    stateCopy[field] = value;
    this.setState(stateCopy);
  }

  handleResetPassword = async() => {
    const {
      password,
    } = this.state;

    console.log('resetting...');
    console.log('password :', password);

    const result = await this.reset({
      resetKey: this.props.match.params.resetKey,
      password,
    });

    console.log('result :', result);

    if(result.affectedRows === 0) {
      message.error('There was an error resetting your password. Please try again by entering your email.');
    } else {
      message.success('Your password has been reset! Please log in to start using Wordlabs.');
    }
    this.props.history.push('/');
  }

  // █▀▀█ █▀▀ █▀▀▄ █▀▀▄ █▀▀ █▀▀█ █▀▀
  // █▄▄▀ █▀▀ █░░█ █░░█ █▀▀ █▄▄▀ ▀▀█
  // ▀░▀▀ ▀▀▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀░▀▀ ▀▀▀

  render = () => (
    <Card style={{ 
      width: 400,
      margin: 'auto',
    }}>
      <Title level={2}>Enter your new password</Title>
      <div>Enter your new password, then once more to confirm and we'll reset it for you.</div>
      <Form
        onKeyUp={e => {
          if(!this.passwordValidation()) return;
          if (e.keyCode === 13 || e.which === 13) {
            this.handleResetPassword();
          }
        }}
      >
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
      </Form>
      <div style={{ textAlign: 'right' }}>
        <Button
          disabled={!this.passwordValidation()}
          type="primary"
          onClick={this.handleResetPassword}
        >Save New Password</Button>
      </div>
    </Card>
  )
}