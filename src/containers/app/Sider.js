import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Icon, Typography, Layout, Row, Col, Badge } from 'antd';
import 'antd/dist/antd.css';
import picker from '../../libs/biggStatusColorPicker';

const Title = Typography
const SubMenu = Menu.SubMenu;
const { Header, Sider } = Layout;

export default class SiderMain extends Component {
  state = {
    currentSelection: 'Dashboard',
  }

  handleSelection = (currentSelection) => {
    if(this.state.currentSelection !== currentSelection) {
      this.setState({currentSelection})
      this.props.loadingComponent(true);
    }
  }

  render() {
    return (
      <div>

        <Header
          style={{
            background: picker('status', 'colorLabel', 'blue').color,
            color: '#ffffff',
            padding: 0,
            height: 'inherit',
            position: 'fixed', zIndex: 11, left: '200px', right: '0'
          }}
        >
          <Row type="flex" align="middle">
            <Col span={24}>
              <div className={'bms_pageHeader'}>{this.props.header}</div>
            </Col>
          </Row>
        </Header>

        <Layout style={{ minHeight: '100vh', position: 'fixed' }}>
          <Sider
            theme="light"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                height: 'inherit',
                maxHeight: '94px',
                margin: '0',
                left: '0',
                right: '0',
                width: '100%',
                maxWidth: '200px',
                background: 'white',
              }}
              className="bms_logo logo"
            >
              <h1 style={{ color: picker('template', 'colorLabel', 'blue').color, fontWeight: 'bold', marginBottom: '0' }}>
                <Icon type="experiment" />
              </h1>
            </div>
            <div style={{
              backgroundColor: '#ffffff',
              overflow: 'auto',
              position: 'fixed',
              left: 0,
              right: 0,
              maxWidth: '200px',
              width: '100%',
              top: '94px',
              bottom: '0'
            }}></div>
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={['/']}
              selectedKeys={[this.props.location.pathname]}
              style={{ paddingTop: 94 }}
            >
              <Menu.Item key="dashboard" id="dashboard" ref="dashboard">
                <NavLink 
                  activeClassName='active-link' exact to={'/'}
                  onClick={() => this.handleSelection('Dashboard')}
                >
                  <Icon type="dashboard" />
                  <span>Dashboard</span>
                </NavLink>
              </Menu.Item>

              <Menu.ItemGroup
                className="bms-ant-menu-item-group-title"
                title="Bookings"
              >
                <Menu.Item key="booking_new" id="booking_new" ref="booking_new">
                  <NavLink 
                    activeClassName='active-link' to={'/booking/new'}
                    onClick={() => this.handleSelection('Add New')}
                  >
                    <Icon type="file-add" />
                    <span>Add New</span>
                  </NavLink>
                </Menu.Item>
                {
                  this.props.jsonStatus &&
                  this.props.jsonStatus.map((status, i) => (
                    <Menu.Item key={i} id={'booking_status_' + i} ref={'booking_status_' + i}>
                      <NavLink 
                        activeClassName='active-link' 
                        to={'/booking/' + status.value.toLowerCase().replace(/ /, '-')}
                        onClick={() => {
                          this.props.changeHeader(picker('status', 'value', status.value).icon, 'Wordlabs', [
                            {url: '/booking/' + status.value.toLowerCase().replace(/ /, '-'), name: status.value}
                          ])
                        }}
                      >
                        <Icon type={picker('status', 'value', status.value).icon} />
                        <span>{status.value}</span>
                        <Badge 
                          count={this.props.getBookingsByStatus(status.value).length}
                          style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }}
                          offset={[5,-15]}
                        />
                      </NavLink>
                    </Menu.Item>
                  ))
                }
              </Menu.ItemGroup>
              
              <Menu.ItemGroup
                className="bms-ant-menu-item-group-title"
                title="My Account"
              >
                <Menu.Item id={'my_account'} ref={'my_account'}>
                  <NavLink activeClassName='active-link' to={'/account/messages'}
                    onClick={() => this.handleSelection('Messages')}
                  >
                    <Icon type="message" />
                    <span>Messages</span>
                  </NavLink>
                </Menu.Item>
                <Menu.Item id={'profile'} ref={'profile'}>
                  <NavLink activeClassName='active-link' to={'/account/profile'}
                    onClick={() => this.handleSelection('Profile')}
                  >
                    <Icon type="user" />
                    <span>Profile</span>
                  </NavLink>
                </Menu.Item>
                <Menu.Item id={'money'} ref={'money'}>
                  <NavLink activeClassName='active-link' to={'/account/money'}
                    onClick={() => this.handleSelection('Money')}
                  >
                    <Icon type="credit-card" />
                    <span>Money</span>
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="3" id="logout" ref="logout" onClick={this.props.logout}>
                  <NavLink to={'/'}
                    onClick={() => this.handleSelection('Log out')}
                  >
                    <Icon type="logout" />
                    <span>Log out</span>
                  </NavLink>
                </Menu.Item>
              </Menu.ItemGroup>
            </Menu>
          </Sider>
        </Layout>
      </div>
    )
  }
}