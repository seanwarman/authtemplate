import Amplify, { API } from 'aws-amplify';
import {endpoints} from './BigglyAPIEndpoints';

Amplify.configure({
  API: {
    endpoints: endpoints
  }
});

// The Wordlabs apiKey for BMS
const bmsApiKey = 'e7fbbc51-06ea-11ea-b969-6dcd26fcdc18';

export default (userKey, browserKey) => {
  const auth = {userKey,browserKey};
  return {
    // █▀▀▄ █▀▀█ █▀▀█ █░█ ░▀░ █▀▀▄ █▀▀▀ █▀▀
    // █▀▀▄ █░░█ █░░█ █▀▄ ▀█▀ █░░█ █░▀█ ▀▀█
    // ▀▀▀░ ▀▀▀▀ ▀▀▀▀ ▀░▀ ▀▀▀ ▀░░▀ ▀▀▀▀ ▀▀▀

    async getBookingsByFilterParams(userKey, start, end, jsonFilter) {
      console.log('jsonFilter :', jsonFilter);
      let result;
      try {
        result = await API.put('biggly', `/bookingpublic2/key/${bmsApiKey}/user/${userKey}/bookings/${start}/${end}`, {
          body: {
            jsonFilter
          }
        });
      } catch (error) {
        console.log('There was an error getting the bookings by div key and status filter: ', error);
        return null;
      }
      return result;
    },
    
    async getBookingDivision(bookingDivKey) {
      try {
        return await API.get('biggly', `/bookingadmin/key/${bmsApiKey}/divisions/${bookingDivKey}`);
      } catch (error) {
        console.log('There was an error trying to get the bookingDivision: ', error);
        return null;
      }    
    },

    async getBookingTemplate(tmpKey) {
      try {
        return await API.get('biggly', `/bookingadmin/key/${bmsApiKey}/templates/${tmpKey}`);
      } catch (error) {
        console.log('There was an error trying to get the template: ', error);
        return null;
      }
    },

    async createBooking(body) {
      try {
        return await API.post('biggly', `/bookingpublic/key/${bmsApiKey}/bookings`, {
          body
        });
      } catch (error) {
        console.log('There wan an error creating the booking: ', error);
        return null;
      }
    },

    async createBMSCustomer(body) {
      try {
        return await API.post('biggly', `/console/key/${bmsApiKey}/customers`, {body});
      } catch (err) {
        console.log('There was an error posting to the create BMS customer endpoint: ', err);
        return null;
      }
    },

    async getUsersCustomers(userKey) {
      try {
        return await API.get('biggly', `/wordlabs/user/${userKey}/customers`);
      } catch (err) {
        console.log('There was an error posting to the get user\'s customers endpoint: ', err);
        return null;
      }
    },
    
    // █▀▀█ █░░█ ▀▀█▀▀ █░░█
    // █▄▄█ █░░█ ░░█░░ █▀▀█
    // ▀░░▀ ░▀▀▀ ░░▀░░ ▀░░▀


    async auth(body) {
      try {
        return await API.post('biggly', `/wordlabs/auth`, {body});
      } catch (err) {
        console.log('There was an error posting to the auth endpoint: ', err);
        return null;
      }
    },

    async notify(body) {
      try {
        return await API.post('biggly', `/wordlabs/notify`, {body});
      } catch (err) {
        console.log('There was an error posting to the create user endpoint: ', err);
        return null;
      }
    },

    async createUser(body) {
      try {
        return await API.post('biggly', `/wordlabs/user`, {body});
      } catch (err) {
        console.log('There was an error posting to the create user endpoint: ', err);
        return null;
      }
    },
    
    async wordlabsCheck(body) {
      try {
        return await API.post('biggly', `/wordlabs/check`, {
          body
        })
      } catch (error) {
        console.log('There was an error checking the user: ', error);
        return null;
      }
    },
    
    // █░░█ █▀▀ █▀▀ █▀▀█
    // █░░█ ▀▀█ █▀▀ █▄▄▀
    // ░▀▀▀ ▀▀▀ ▀▀▀ ▀░▀▀
    
    async getUser(userKey) {
      console.log('auth :', auth);
      try {
        return await API.get('biggly', `/wordlabs/user/${userKey}`, {
          headers: auth
        });
      } catch (error) {
        console.log('There was an error getting user\'s record: ', error);
        return null;
      }
    },

    async updateUser(userKey, body) {
      console.log('body :', body);
      try {
        return await API.put('biggly', `/wordlabs/user/${userKey}`, {auth, body});
      } catch (err) {
        console.log('There was an error posting to the create user endpoint: ', err);
        return null;
      }
    },
  }
}