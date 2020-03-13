import React, {Component} from 'react';
import {Select, Form, Input, Icon, Button, Row, Col, DatePicker, message} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import JsonBuilder from '@seanwarman/json-form-builder';

const validator = JsonBuilder('jsonFormValidator');

const {Option} = Select;

export default class AddAndSelect extends Component {

  state = {
    options: null,
    loading: false,
    newOption: '',
  }

  // █░░ ░▀░ █▀▀ █▀▀ █▀▀ █░░█ █▀▀ █░░ █▀▀   █░░█ █▀▀█ █▀▀█ █░█ █▀▀
  // █░░ ▀█▀ █▀▀ █▀▀ █░░ █▄▄█ █░░ █░░ █▀▀   █▀▀█ █░░█ █░░█ █▀▄ ▀▀█
  // ▀▀▀ ▀▀▀ ▀░░ ▀▀▀ ▀▀▀ ▄▄▄█ ▀▀▀ ▀▀▀ ▀▀▀   ▀░░▀ ▀▀▀▀ ▀▀▀▀ ▀░▀ ▀▀▀

  componentDidMount() {
    this.loadDataAndSetState()
  }

  async loadDataAndSetState() {
    let stateCopy = { ...this.state };
    const options = await this.props.getOptions();
    if(options) {
      stateCopy.options = options;
    }
    stateCopy.loading = false;
    this.setState(stateCopy);
  }

  // █░░█ █▀▀█ █▀▀▄ █▀▀▄ █░░ █▀▀ █▀▀█ █▀▀
  // █▀▀█ █▄▄█ █░░█ █░░█ █░░ █▀▀ █▄▄▀ ▀▀█
  // ▀░░▀ ▀░░▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀▀▀ ▀░▀▀ ▀▀▀

  handleNewOption = async newOption => {
    this.setState({loading: true});
    let result = await this.props.create(newOption);
    if(result.affectedRows === 1) {
      message.success(newOption + ' saved successfully.');
    }
    this.loadDataAndSetState();
  }

  // █▀▀ ▀█░█▀ █▀▀ █▀▀▄ ▀▀█▀▀ █▀▀
  // █▀▀ ░█▄█░ █▀▀ █░░█ ░░█░░ ▀▀█
  // ▀▀▀ ░░▀░░ ▀▀▀ ▀░░▀ ░░▀░░ ▀▀▀

  onSearch = value => {
    this.setState({newOption: value})
  }

  onKey = e => {
    if(this.state.newOption.length === 0) return;
    if(e.keyCode === 13 || e.which === 13) {
      console.log('enter!');
      this.handleNewOption(this.state.newOption);
    }
  }

  // █▀▀█ █▀▀ █▀▀▄ █▀▀▄ █▀▀ █▀▀█ █▀▀
  // █▄▄▀ █▀▀ █░░█ █░░█ █▀▀ █▄▄▀ ▀▀█
  // ▀░▀▀ ▀▀▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀░▀▀ ▀▀▀

  render() {
    const { placeHolder, optionKey, optionDisplay } = this.props;
    const { options } = this.state;
    return (
      options &&
      <Select
        loading={this.state.loading}
        showSearch
        style={{ width: '100%' }}
        placeholder={placeHolder}
        onChange={this.props.onChange}
        onSearch={this.onSearch}
        onInputKeyDown={this.onKey}
        optionFilterProp="children"
        filterOption={(input, option) => (
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )}
      >
        {
          options.length > 0 &&
          options.sort((a,b) => {
            if(a[optionDisplay].toLowerCase() < b[optionDisplay].toLowerCase()) return -1;
            if(a[optionDisplay].toLowerCase() > b[optionDisplay].toLowerCase()) return 1;
            return 0;
          })
          .map(option => (
            <Select.Option
              key={option[optionKey]}
              value={option[optionKey]}
            >{option[optionDisplay]}</Select.Option>
          ))
        }
      </Select>
    );
  }
}
