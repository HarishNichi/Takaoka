import { toastDisplay } from "@/helper";
import axios from "@/utils/api";

/* Identity and Access management (IAM) */
export const MapServices = {
  getPlaceList: _getPlaceList,
};

/**
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getPlaceList(callBackFun, payload = {}) {
  axios
    .post("/user/place/list", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      toastDisplay(error?.response);
    });
}