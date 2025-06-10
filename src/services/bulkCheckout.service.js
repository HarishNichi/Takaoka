import { toastDisplay } from "@/helper";
import axios from "@/utils/api";

export const BulkCheckoutService = {
  getPlacesList: _getPlacesList,
  getEventsList: _getEventsList,
  checkoutBulkEvents: _checkoutBulkEvents,
  checkoutBulkPlaces: _checkoutBulkPlaces,
};

/**
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getPlacesList(callBackFun) {
  axios
    .get("/admin/place/history/dropdown/list")
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
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getEventsList(payload, callBackFun) {
  axios
    .post("/admin/events/dropdown/status/list", payload)
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
 * Update place by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _checkoutBulkPlaces(payload, callBackFun) {
  axios
    .put(`/admin/place/bulk/checkout`, payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
      toastDisplay(response);
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error?.response);
    });
}


/**
 * Update place by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _checkoutBulkEvents(payload, callBackFun) {
  axios
    .put(`/admin/events/bulk/checkout`, payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
      toastDisplay(response);
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error?.response);
    });
}