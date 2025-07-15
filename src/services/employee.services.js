
import axios from '@/utils/api';
import { toastDisplay } from '@/helper';
export const EmployeeServices = {
  getEmployeeList: _getEmployeeList,
  exportEmployeeCSV: _exportEmployeeCSV,
  importData: _importData,
  updateEmployee: _updateEmployee,
};

/**
 * Get Employee List
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getEmployeeList(payload, callBackFun) {

  axios
    .post("/admin/employee/list", payload)
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
 * Export Employee List to CSV
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportEmployeeCSV(payload, callBackFun) {
  // 📝 REAL API (Uncomment when backend is ready)
  axios
    .post("/admin/employee/export", payload)
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
 * Import place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _importData(payload, callBackFun) {
  axios
    .post("/admin/employee/bulk/import", payload)
    .then((response) => {
      callBackFun(response);
      toastDisplay(response, 'import');
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error.response, 'import');
    });
}

/**
 * Update Employee
 * @param {*} payload
 * @param {*} callBackFun
 */
function _updateEmployee(payload, callBackFun) {
  axios
    .post("/admin/employee/edit", payload)
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
