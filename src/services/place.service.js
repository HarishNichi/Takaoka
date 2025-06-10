import axios from "@/utils/api";
import { downloadBase64File, getYYYYMMDDHHSSSSDateTimeFormat, toastDisplay } from "@/helper";

export const PlaceServices = {
  importData: _importData,
  exportData: _exportData,
  getList: _getList,
  create: _create,
  update: _update,
  details: _details,
  deletePlace: _deletePlace,
  updateStatus: _updateStatus,
  getAddressByZipCode: _getAddressByZipCode,
};

/**
 * Import place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _importData(payload, callBackFun) {
  axios
    .post("/admin/place/import", payload)
    .then((response) => {
      callBackFun(response);
      toastDisplay(response, 'import');
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      callBackFun(false);
      toastDisplay(error.response, 'import');
    });
}

/**
 * Export place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportData(payload, callBackFun) {
  axios
    .post("/admin/place/export", payload)
    .then((response) => {
      if (response && response.data && response.data.result.filePath) {
        let date = getYYYYMMDDHHSSSSDateTimeFormat(new Date());
        downloadBase64File(response.data.result.filePath, `Place_${date}.csv`);
        toastDisplay(response);
      }
    })
    .catch((error) => {
      toastDisplay(error?.response);
    });
}

/**
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getList(payload, callBackFun) {
  axios
    .post("/admin/place/list", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      callBackFun(false);
    });
}

/**
 * Create a new place
 * @param {*} payload
 * @param {*} callBackFun
 */
function _create(payload, callBackFun) {
  axios
    .post("/admin/place", payload)
    .then((response) => {
      callBackFun(response.data);
      if (response && response.data) {
        toastDisplay(response);
      }
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error.response);
    });
}

/**
 * Update place by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _update(payload, callBackFun) {
  axios
    .put(`/admin/place/update`, payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
        toastDisplay(response);
      }
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error.response);
    });
}

/**
 * Get place details by id
 * @param {*} id
 * @param {*} callBackFun
 */
function _details(id, callBackFun) {
  const params = {
    id: id,
  };
  axios
    .post(`/admin/place/detail`, params)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

/**
 * Update place status by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _updateStatus(payload, callBackFun) {
  axios
    .put(`/admin/place/status/update`, payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
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

/**
 * delete place by id
 * @param {*} id
 * @param {*} callBackFun
 */
function _deletePlace(id, callBackFun) {
  axios
    .delete(`/admin/place/delete`, { data: { id: id } })
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
        toastDisplay(response);
      }
    })
    .catch((error) => {
      toastDisplay(error?.response);
    });
}