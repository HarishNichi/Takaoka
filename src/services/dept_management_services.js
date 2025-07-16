

import axios from '@/utils/api';
import { toastDisplay } from '@/helper';
export const DepartmentManagementServices = {
  getDeptList: _getDeptList,
  exportDepartmentCSV: _exportDepartmentCSV,
  addDepartment: _addDepartment,
  updateDepartment: _updateDepartment,
  deleteDepartment: _deleteDepartment,
  getUserDepartmentDropdown: _getUserDepartmentDropdown,
};

/**
 * Get Employee List
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getDeptList(payload, callBackFun) {

  
  axios
    .post("/admin/department/list", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      toastDisplay(error?.response);
    });
  
}


function _exportDepartmentCSV(payload, callBackFun) {
  // ✅ MOCK RESPONSE
   axios
    .post("/admin/department/export", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      toastDisplay(error?.response);
    });
}
function _addDepartment(payload, callBackFun) {
  axios
    .post("/admin/department", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      toastDisplay(error?.response);
      callBackFun(false);
    });
}
function _updateDepartment(payload, callBackFun) {
   axios
    .put("/admin/department/update", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      toastDisplay(error?.response);
      callBackFun(false);
    });
}
function _deleteDepartment(payload, callBackFun) {
  console.log("payload", payload);
  // ✅ MOCK RESPONSE
   axios.delete('/admin/department/delete', { data: { "id": payload } })
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

/**
 * Get department dropdown for user (new API)
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getUserDepartmentDropdown(payload, callBackFun) {
  axios.post('user/department/dropdown', payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      toastDisplay(error?.response);
    });
}

DepartmentManagementServices.getUserDepartmentDropdown = _getUserDepartmentDropdown;