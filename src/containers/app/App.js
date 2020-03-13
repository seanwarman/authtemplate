import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';

import api from '../../libs/ApiMethods';

import {Row, Col, Breadcrumb, Icon} from 'antd';
import SiderComponent from './Sider';
import PageWrapper from '../../components/layout/PageWrapper';
import Authenticated from '../../containers/routes/Authenticated';
import Unauthenticated from '../../containers/routes/Unauthenticated';

import color from '../../libs/biggStatusColorPicker';
import './App.css';
import 'antd/dist/antd.css';

const siteBasePath = window.location.origin;

class App extends Component {

  state = {
    auth: false,
    browserKey: null,
    loaded: false,
    componentLoading: false,
    changeHeader: null,
    bookingDivision: null,
    bookingDivKey: null,
    partnerKey: null,
    header: null,
    tmpKey: null,
    bookings: null,
    user: null,
    userKey: null,
  }

  // █░░ ░▀░ █▀▀ █▀▀ █▀▀ █░░█ █▀▀ █░░ █▀▀
  // █░░ ▀█▀ █▀▀ █▀▀ █░░ █▄▄█ █░░ █░░ █▀▀
  // ▀▀▀ ▀▀▀ ▀░░ ▀▀▀ ▀▀▀ ▄▄▄█ ▀▀▀ ▀▀▀ ▀▀▀

  componentDidMount() {
    this.loadDataAndSetState();
  }

  loadDataAndSetState = async() => {
    let initialState;
    const checkResult = await this.checkLocalStorageAndGetUserDetails();
    if(!checkResult) {
      initialState = this.populateUnauthorisedState();
    } else {
      initialState = await this.populateAuthorisedState(
        checkResult.userKey,
        checkResult.browserKey,
        checkResult.bookingDivKey,
        checkResult.partnerKey,
        this.renderHeader
      );
      initialState.bookings = await api().getBookingsByFilterParams(
        checkResult.userKey, 
        0, 
        2000, 
        [
          {
            key: 'bms_booking.bookings.createdUserKey',
            value: checkResult.userKey,
          },
        ]
      )
    }

    initialState.loaded = true;
    this.setState(initialState);
  }

  populateAuthorisedState = async(userKey, browserKey, bookingDivKey, partnerKey, renderHeader) => {
    let bookingDivision = await api().getBookingDivision(bookingDivKey) 
    return {
      browserKey,
      bookingDivision,
      changeHeader: renderHeader,
      auth: true,
      bookingDivKey,
      partnerKey,
      userKey,
      tmpKey: '37bc49b0-07ab-11ea-845c-af33160936b5',
      user: {
        userKey,
        partnerKey,
      },
    }
  }

  populateUnauthorisedState = () => {
    return {
      auth: false,
      browserKey: null,
      user: null,
      bookingDivision: null,
      partnerKey: null,
      bookingDivKey: null,
      changeHeader: null,
      header: null,
      tmpKey: null,
      user: null,
      userKey: null,
    }
  }

  // █░░█ █▀▀ █▀▀ █▀▀█   █▀▀█ █░░█ ▀▀█▀▀ █░░█
  // █░░█ ▀▀█ █▀▀ █▄▄▀   █▄▄█ █░░█ ░░█░░ █▀▀█
  // ░▀▀▀ ▀▀▀ ▀▀▀ ▀░▀▀   ▀░░▀ ░▀▀▀ ░░▀░░ ▀░░▀

  checkLocalStorageAndGetUserDetails = async() => {
    let body;
    try {
      body = JSON.parse(window.localStorage.wordlabs);
    } catch (err) {
      body = null;
    }

    let result;
    if(body) {
      result = await api().wordlabsCheck(body);
    }

    if((result || {affectedRows: 0}).affectedRows === 0) {
      console.log('No browserKey redirect to login.')
      return null;
    }
    body.browserKey = result.browserKey;
    window.localStorage.wordlabs = JSON.stringify(body);
    return result;
  }
  
  // █░░█ ▀▀█▀▀ ░▀░ █░░ ░▀░ ▀▀█▀▀ ░▀░ █▀▀ █▀▀
  // █░░█ ░░█░░ ▀█▀ █░░ ▀█▀ ░░█░░ ▀█▀ █▀▀ ▀▀█
  // ░▀▀▀ ░░▀░░ ▀▀▀ ▀▀▀ ▀▀▀ ░░▀░░ ▀▀▀ ▀▀▀ ▀▀▀

  loadingComponent = (bool) => {
    this.setState({componentLoading: bool});
  }

  getStatusString = statusOrUrl => (
    statusOrUrl === 'draft' ?
    'Draft'
    :
    statusOrUrl === 'live' ?
    'Live'
    :
    statusOrUrl === 'in-progress' ?
    'In Progress'
    :
    statusOrUrl === 'qa' ?
    'QA'
    :
    statusOrUrl === 'complete' ?
    'Complete'
    :
    statusOrUrl
  )

  getBookingsByStatus = (status) => (
    (this.state.bookings || []).filter(booking => booking.currentStatus === this.getStatusString(status))
  )

  // █░░█ █▀▀█ █▀▀▄ █▀▀▄ █░░ █▀▀ █▀▀█ █▀▀
  // █▀▀█ █▄▄█ █░░█ █░░█ █░░ █▀▀ █▄▄▀ ▀▀█
  // ▀░░▀ ▀░░▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀▀▀ ▀░▀▀ ▀▀▀

  handleAuthenticated = async(browserKey, emailAddress) => {
    let wordlabs = JSON.stringify({browserKey, emailAddress});
    window.localStorage.wordlabs = wordlabs;
    this.loadDataAndSetState();
  }

  handleLogout = () => {
    delete window.localStorage.wordlabs;
    this.loadDataAndSetState()
  }
  
  // █▀▀█ █▀▀ █▀▀▄ █▀▀▄ █▀▀ █▀▀█ █▀▀
  // █▄▄▀ █▀▀ █░░█ █░░█ █▀▀ █▄▄▀ ▀▀█
  // ▀░▀▀ ▀▀▀ ▀░░▀ ▀▀▀░ ▀▀▀ ▀░▀▀ ▀▀▀

  renderHeader = (icon, divisionName, array) => {
    this.setState({
      header: <div className="bms-content-header-parent">
        <Icon style={{ fontSize: 30 }} type={icon} />
        <h3 className='bms-text-light' style={{ lineHeight: '1em', marginBottom: 20, marginTop: 20, paddingLeft: '15px' }}>
          {array && array[array.length - 1].name}

          <Breadcrumb style={{ display: 'block', fontWeight: '300', marginTop: '5px' }}>
            <Breadcrumb.Item>{divisionName}</Breadcrumb.Item>
            {array && array.map((item, index) => (
              <Breadcrumb.Item key={index} className='breadcrumbChild'><Link to={item.url}>{item.name}</Link></Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </h3>
      </div>
    });
  }

  render() {
    const {changeHeader, auth, loaded, componentLoading, user, bookingDivision, bookingDivKey, tmpKey, bookings} = this.state;
    const props = {
      authenticated: this.handleAuthenticated,
      loadingComponent: this.loadingComponent,
      getBookingsByStatus: this.getBookingsByStatus,
      getStatusString: this.getStatusString,
      componentLoading,
      bookingDivision, 
      bookingDivKey,
      origin: siteBasePath,
      api: api(
        this.state.browserKey && this.state.browserKey,
        this.state.userKey && this.state.userKey
      ),
      changeHeader,
      user,
      tmpKey,
      bookings,
      ...this.props,
    }

    return (
      loaded &&
      <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
        {
          auth ?
          <Row style={{display: 'flex'}}>
            <Col style={{width: 237}}>
              {
                // this.state.bookings.length &&
                <SiderComponent
                  getBookingsByStatus={this.getBookingsByStatus}
                  header={this.state.header}
                  jsonStatus={this.state.bookingDivision.jsonStatus}
                  location={this.props.location} 
                  logout={this.handleLogout}
                  changeHeader={changeHeader}
                  loadingComponent={this.loadingComponent}
                />
              }
            </Col>
            <Col style={{width: '100%'}}>
                <div style={{
                  minHeight: 280,
                  width: '100%',
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  zIndex: 2,
                  background: '#f0f2f5',
                  pointerEvents: 'none',
                  opacity: this.state.componentLoading ? 1 : 0
                }}>
                  <Icon 
                    style={{fontSize: 80, color: color('status', 'colorLabel', 'blue').color}}
                    type="loading" 
                  />
                </div>
              <PageWrapper>
                <Authenticated {...props} />
              </PageWrapper>
            </Col>
          </Row>
          :
          <Unauthenticated {...props} />
        }
      </div>
    )
  }
}

export default withRouter(App);
