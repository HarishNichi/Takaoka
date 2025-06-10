import axios from "@/utils/api";
import { downloadBase64File, getYYYYMMDDHHSSSSDateTimeFormat, toastDisplay } from "@/helper";

export const SpecialCareServices = {
  importData: _importSpecialCareData,
  exportData: _exportSpecialCareData,
  getList: _getSpecialCareList,
  create: _createSpecialCare,
  update: _updateSpecialCare,
  details: _specialCareDetails,
  deleteSpecialCare: _deleteSpecialCare
};

function _importSpecialCareData(payload, callBackFun) {
  axios
    .post("/admin/specialcare/import", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response);
        toastDisplay(response, "import");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      callBackFun(false);
      toastDisplay(error.response, "import");
    });
}

function _exportSpecialCareData(payload, callBackFun) {
  axios
    .post("/admin/specialcare/export", payload)
    .then((response) => {
      if (response && response.data && response.data.result.filePath) {
        let date = getYYYYMMDDHHSSSSDateTimeFormat(new Date());
        downloadBase64File(response.data.result.filePath, `SpecialCare_${date}.csv`);
        toastDisplay(response);
      }
    })
    .catch((error) => {
      toastDisplay(error?.response);
    });
}

function _getSpecialCareList(payload, callBackFun) {
  axios
    .post("/admin/specialcare/list", payload)
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

function _createSpecialCare(payload, callBackFun) {
  axios
    .post("/admin/specialcare/store", payload)
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

function _updateSpecialCare(payload, callBackFun) {
  axios
    .put(`/admin/specialcare/update`, payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
        toastDisplay(response);
      }
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error?.response);
    });
}

function _specialCareDetails(id, callBackFun) {
  const params = {
    params: {
      id: id,
    },
  };
  axios
    .get(`/admin/specialcare/${id}`, params)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function _deleteSpecialCare(id, callBackFun) {
  axios
    .delete(`/admin/specialcare/delete`, { data: { id: id } })
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
        toastDisplay(response);
      }
    })
    .catch((error) => {
      toastDisplay(error?.response);
      callBackFun(false);
    });
}