import React, { Component } from 'react';
import {Icon, Card, Radio, Row, Col, Button, InputNumber, Slider} from 'antd';
import BiggColorsAndIcons from '../../mixins/BiggColorsAndIcons';

// █▀▄▀█ ░▀░ █▀▀▄ ░▀░ ░░░ █▀▀ █▀▀█ █▀▄▀█ █▀▀█ █▀▀█ █▀▀▄ █▀▀ █▀▀▄ ▀▀█▀▀ █▀▀
// █░▀░█ ▀█▀ █░░█ ▀█▀ ▀▀▀ █░░ █░░█ █░▀░█ █░░█ █░░█ █░░█ █▀▀ █░░█ ░░█░░ ▀▀█
// ▀░░░▀ ▀▀▀ ▀░░▀ ▀▀▀ ░░░ ▀▀▀ ▀▀▀▀ ▀░░░▀ █▀▀▀ ▀▀▀▀ ▀░░▀ ▀▀▀ ▀░░▀ ░░▀░░ ▀▀▀

class RadioCard extends Component {
  render = () => (
    <Card
      style={{ position: 'relative', marginBottom: 16 }}
    >
      <Radio value={this.props.radioValue}>{this.props.children}</Radio>
      <div
        style={{ position: 'absolute', right: 20, top: 16, fontSize: 24 }}
      >{this.props.icon}</div>
    </Card>
  )
}

// █▀▄▀█ █▀▀█ ░▀░ █▀▀▄ ░░░ █▀▀ █▀▀█ █▀▄▀█ █▀▀█ █▀▀█ █▀▀▄ █▀▀ █▀▀▄ ▀▀█▀▀
// █░▀░█ █▄▄█ ▀█▀ █░░█ ▀▀▀ █░░ █░░█ █░▀░█ █░░█ █░░█ █░░█ █▀▀ █░░█ ░░█░░
// ▀░░░▀ ▀░░▀ ▀▀▀ ▀░░▀ ░░░ ▀▀▀ ▀▀▀▀ ▀░░░▀ █▀▀▀ ▀▀▀▀ ▀░░▀ ▀▀▀ ▀░░▀ ░░▀░░

export default class New extends Component {

  state = {
    bookingTemplateSelectionKey: null,
    wordCount: 100,
  }
  
  // █░░ ░▀░ █▀▀ █▀▀ █▀▀ █░░█ █▀▀ █░░ █▀▀
  // █░░ ▀█▀ █▀▀ █▀▀ █░░ █▄▄█ █░░ █░░ █▀▀
  // ▀▀▀ ▀▀▀ ▀░░ ▀▀▀ ▀▀▀ ▄▄▄█ ▀▀▀ ▀▀▀ ▀▀▀

  componentDidMount() {
    this.props.changeHeader('file-add', 'Wordlabs', [{url: '/booking/new', name: 'New'}]);
    this.props.loadingComponent(false);
  }

  // █░░█ █▀▀█ █▀▀▄ █▀▀▄ █░░ █▀▀ █▀▀█ █▀▀
  // █▀▀█ █▄▄█ █░░█ █░░█ █░░ █▀▀ █▄▄▀ ▀▀█
  // ▀░░▀ ▀░░▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀▀▀ ▀░▀▀ ▀▀▀

  handleContinueToBookingForm = () => {
    if(!this.state.bookingTemplateSelectionKey) return;
    this.props.history.push(
      '/booking/form/' + BiggColorsAndIcons.bookingTypes[this.state.bookingTemplateSelectionKey - 1].value + '/' + this.state.wordCount
    );
  }

  handleBookingTypeSelection = e => {
    let stateCopy = { ...this.state };
    stateCopy.bookingTemplateSelectionKey = e.target.value;
    this.setState(stateCopy);
  }

  // █▀▀ ▀█░█▀ █▀▀ █▀▀▄ ▀▀█▀▀ █▀▀
  // █▀▀ ░█▄█░ █▀▀ █░░█ ░░█░░ ▀▀█
  // ▀▀▀ ░░▀░░ ▀▀▀ ▀░░▀ ░░▀░░ ▀▀▀

  onWordCount = wordCount => {
    this.setState({wordCount: Number(wordCount)});
  }
  
  // █▀▀█ █▀▀ █▀▀▄ █▀▀▄ █▀▀ █▀▀█ █▀▀
  // █▄▄▀ █▀▀ █░░█ █░░█ █▀▀ █▄▄▀ ▀▀█
  // ▀░▀▀ ▀▀▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀░▀▀ ▀▀▀ 

  render() {
    return (
      <Row gutter={16}>
        <h3 style={{paddingLeft: 16, marginBottom: 24, textAlign: 'center'}}>What type of content do you need?</h3>
        <Radio.Group onChange={this.handleBookingTypeSelection} style={{width: '100%'}}>
          {
            BiggColorsAndIcons.bookingTypes.map((item,i) => (
              <Col span={12} key={i}>
                <RadioCard radioValue={i + 1} icon={<Icon type={item.icon} />}>
                  {item.value}
                </RadioCard>
              </Col>
            ))
          }
        </Radio.Group>
        <div style={{textAlign: 'center', marginTop: 24}}>
          <h5 level={4}>Word Count</h5>
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Slider
            min={0}
            max={1000}
            onChange={this.onWordCount}
            value={this.state.wordCount}
            step={100}
            marks={{
              0: 0,
              200: 200,
              400: 400,
              600: 600,
              800: 800,
              1000: 1000,
            }}
            style={{width: 500}}
          />
          <InputNumber
            min={0}
            max={1000}
            onChange={this.onWordCount}
            value={this.state.wordCount}
            style={{marginLeft: 16}}
          />
        </div>
        <div style={{textAlign: 'center', paddingRight: 3, marginTop: 24}}>
          <Button
            type="primary"
            disabled={!this.state.bookingTemplateSelectionKey || this.state.wordCount === 0}
            onClick={this.handleContinueToBookingForm}
          >Save and continue</Button>
        </div>
      </Row>
    )
  }
}
