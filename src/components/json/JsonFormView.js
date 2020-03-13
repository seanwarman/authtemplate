import React, { Component } from "react";
import {
  Col,
  Skeleton,
} from 'antd';
import moment from 'moment';

let key = 0;

export default class JsonFormView extends Component {

  state = {

  };

  getTagFromPropsOrSetDiv = index => {
    const tags = this.props.tags;
    if(tags) {
      return tags[index] ? tags[index] : 'div';
    } else {
      return 'div';
    }
  }
  
  renderUneditableForm = (jsonForm, customFields) => {
    const form = [...customFields, ...jsonForm];
    const {showLabels} = this.props;
    const uneditableTextareaStyles = {
      // background: '#ffffff',
      background: 'transparent',
      border: 'none',
      width: '100%',
      overflow: 'hidden',
      resize: 'none'
    }
    return (
      form.length > 0 ?
        form.map((item, index) => {
          
          const Tag = this.getTagFromPropsOrSetDiv(index);

          return (
            item.value || item.children ?
              item.type === 'date' ?
                <Col key={key++} span={24}>
                  <Tag>
                    <b>{showLabels && item.label + ': '}</b> {moment(item.value).format('DD/MM/YYYY')}
                  </Tag>
                </Col>
                :
                item.type === 'textarea' ?
                  <Col key={key++} span={24}>
                    <Tag>
                      <b>{showLabels && item.label + ': '}</b> <textarea className="formjson-textarea" span={24} disabled style={uneditableTextareaStyles} value={item.value} />
                    </Tag>
                  </Col>
                  :
                  item.type === 'dropdown' ?
                    <Col key={key++} span={24}>
                      <Tag>
                        <b>{showLabels && item.label + ': '}</b> {item.value}
                      </Tag>
                    </Col>
                    :
                    item.type === 'multi' ?
                      item.children.map((child, childIndex) => (
                        (child[0].value || '').length > 0 && (child[1].value || '').length > 0 &&
                        <Tag key={childIndex} id="multi-wrapper">
                          <b>{showLabels && child[0].label + ': '}</b> {child[0].value}
                          <b>{showLabels && child[1].label + ': '}</b> <textarea span={24} className="formjson-textarea" disabled style={uneditableTextareaStyles} value={child[1].value} />
                        </Tag>
                      ))
                      :
                      <Col key={key++} span={24}>
                        <Tag>
                          <b>{showLabels && item.label + ': '}</b> {item.value}
                        </Tag>
                      </Col>
              :
              null
          )
        })
        :
        <Skeleton active paragraph={{ rows: 4 }} />
    )
  }
  render() {
    let customFields = this.props.customFields;
    if(!customFields) customFields = [];
    let jsonForm = this.props.jsonForm;
    if(!jsonForm) jsonForm = [];
    return this.renderUneditableForm(jsonForm, customFields);
  }
}