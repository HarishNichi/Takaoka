import axios from "@/utils/api";
import { toastDisplay } from "@/helper";

/* Identity and Access management (IAM) */
export const ExternalServices = {
  getActivePlaceList: _getActivePlaceList,
  create: _create,
  getAddressByZipCode: _getAddressByZipCode,
};

/**
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getActivePlaceList(callBackFun) {
  const payload = {
    "filters": {
      "sort_by": "refugee_name",
      "order_by": "asc"
    },
    "search": "",
    "map": true
  };
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

/**
 * Register External
 * @param {*} payload
 * @param {*} callBackFun
 */
function _create(payload, callBackFun) {
  axios
    .post("/user/external", payload)
    .then((response) => {
      callBackFun(response.data);
      if (response && response.data) {
        // Commented for now as per ticket might be useful in future
        // toastDisplay(response);
      }
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error?.response);
    });
}

/**
 * Get address information by zip code
 * @param {string} zipCode - The zip code to search for.
 * @param {Function} callBackFun - The callback function to handle the response data.
 */
async function _getAddressByZipCode(zipCode, callBackFun) {
  try {
    const response = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`
    );
    const data = await response.json();
    if (data.results) {
      callBackFun(data.results);
    } else {
      data && callBackFun();
    }
  } catch (error) {
    console.error("Error fetching address data:", error);
  }
}