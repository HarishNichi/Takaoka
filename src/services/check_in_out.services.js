import axios from '@/utils/api';
import { toastDisplay } from '@/helper';
import toast from 'react-hot-toast';

/* Identity and Access management (IAM) */
export const CheckInOutServices = {
  getList: _getList,
  getEventList: _getEventList,
  checkIn: _checkIn,
  checkOut: _checkOut,
  eventCheckOutAddOns: _eventCheckOut,
  eventCheckIn: _event_checkIn,
  eventCheckOut: _event_checkOut,
  basicInfo: _basicInfo,
  placeCheckout: _placeCheckout,
};

/**
 * Get dashboard list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
  axios.post('/user/family/search', payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
        toast.success(response?.data?.message, {
          position: "top-right",
        });
      }
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error?.response);
    });
}

/**
 * Get dashboard list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getEventList(payload, callBackFun) {
  axios.post('/user/event/manual/search ', payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error?.response);
    });
}

/**
 * Create a new place
 * @param {*} payload
 * @param {*} callBackFun
 */
function _checkIn(payload, callBackFun) {
  axios
    .put("/user/update/family/checkin", payload)
    .then((response) => {
      callBackFun(response.data);
      if (response && response.data) {
        toastDisplay(response);
      }
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error?.response);
    });
}


/**
 * Create a new place
 * @param {*} payload
 * @param {*} callBackFun
 */
function _checkOut(payload, callBackFun) {
  axios
    .put("/user/update/family/checkout", payload)
    .then((response) => {
      callBackFun(response.data);
      if (response && response.data) {
        toastDisplay(response);
      }
    })
    .catch((error) => {
      callBackFun(false)
      toastDisplay(error?.response);
    });
}

/**
 * Create a new place
 * @param {*} payload
 * @param {*} callBackFun
 */
function _eventCheckOut(payload, callBackFun) {
  axios
    .post("/user/event/manual/checkout", payload)
    .then((response) => {
      callBackFun(response.data);
      if (response && response.data) {
        toastDisplay(response);
      }
    })
    .catch((error) => {
      callBackFun(false)
      toastDisplay(error?.response);
    });
}

/**
* Create a new place
* @param {*} payload
* @param {*} callBackFun
*/
function _event_checkIn(payload, callBackFun) {
  axios
    .post("/user/event/checkin", payload)
    .then((response) => {
      callBackFun(response.data);
      if (response && response.data) {
        toastDisplay(response);
      }
    })
    .catch((error) => {
      callBackFun();
      toastDisplay(error?.response);
    });
}
/**
* fetch basic info
* @param {*} payload
* @param {*} callBackFun
*/
function _basicInfo(payload, callBackFun) {
  const currentUrl = window.location.pathname;
  let apiEndpoint = "/user/basic/info";
  if (currentUrl.startsWith("/staff/temporary/family")) {
    apiEndpoint = "/user/basic/info/search"; // change this to your desired endpoint
  }
  axios
    .post(apiEndpoint, payload)
    .then((response) => {
      callBackFun(response.data);
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error?.response);
    });
}


/**
* Create a new place
* @param {*} payload
* @param {*} callBackFun
*/
function _event_checkOut(payload, callBackFun) {
  axios
    .post("/user/event/checkout", payload)
    .then((response) => {
      callBackFun(response.data);
      if (response && response.data) {
        toastDisplay(response);
      }
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error?.response);
    });
}


/**
* Create a new place
* @param {*} payload
* @param {*} callBackFun
*/
function _placeCheckout(payload, callBackFun) {
  axios
    .post("/user/permanent/checkout", payload)
    .then((response) => {
      if (response) {
        toastDisplay(response);
      }
      callBackFun(response.data);
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error?.response);
    });
}